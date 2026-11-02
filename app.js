"use strict";
const fileInput = document.getElementById("file");
const statusEl = document.getElementById("status");
let rows = [];

function parseCSV(text) {
  const records = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field.replace(/\r$/, "")); records.push(row); row = []; field = ""; }
    else field += c;
  }
  if (field.length || row.length) { row.push(field.replace(/\r$/, "")); records.push(row); }
  const headers = (records.shift() || []).map(v => v.trim().replace(/^\uFEFF/, "").toLowerCase().replace(/\s+/g, "_"));
  return records.filter(r => r.some(v => v.trim())).map(r => {
    const o = {};
    headers.forEach((h, i) => { o[h] = (r[i] || "").trim(); });
    return o;
  });
}
function normalize(rowsIn) {
  if (!rowsIn.length) return [];
  const sample = rowsIn[0];
  const wide = ["petrol_usd_liter", "gasoline_usd_per_liter", "diesel_usd_liter", "diesel_usd_per_liter", "lpg_usd_liter", "lpg_usd_per_liter"].some(k => Object.prototype.hasOwnProperty.call(sample, k));
  if (!wide) return rowsIn.map(r => Object.assign({}, r, {
    year: String(r.year || r.date || "").slice(0, 4),
    tax_rate_pct: r.tax_rate_pct || r.tax_percentage || r.tax_pct_of_pump_price || "",
    income_group: r.income_group || r.income_level || "",
    subsidy_level: r.subsidy_level || r.subsidy_regime || ""
  }));
  const fields = [
    ["petrol_usd_liter", "Petrol"], ["gasoline_usd_per_liter", "Petrol"],
    ["diesel_usd_liter", "Diesel"], ["diesel_usd_per_liter", "Diesel"],
    ["lpg_usd_liter", "LPG"], ["lpg_usd_per_liter", "LPG"]
  ];
  const result = [];
  rowsIn.forEach(r => fields.forEach(([key, fuel]) => {
    const value = r[key];
    if (value !== undefined && value !== "" && Number.isFinite(Number(value))) {
      result.push({
        date: r.date || "", year: String(r.year || r.date || "").slice(0, 4),
        country: r.country || "", region: r.region || "", fuel_type: fuel,
        retail_price_usd_per_liter: value,
        tax_rate_pct: r.tax_percentage || r.tax_pct_of_pump_price || "",
        income_group: r.income_level || r.income_group || "",
        subsidy_level: r.subsidy_level || r.subsidy_regime || "",
        brent_crude_usd_per_barrel: r.brent_crude_usd || r.brent_crude_usd_per_barrel || ""
      });
    }
  }));
  return result;
}
function num(row, key) {
  const value = String(row[key] == null ? "" : row[key]).replace(/[$,%]/g, "").replace(/USD/g, "").replace(/,/g, "").trim();
  return value && Number.isFinite(Number(value)) ? Number(value) : null;
}
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function mean(a) { return a.length ? a.reduce((x, y) => x + y, 0) / a.length : null; }
function money(v) { return v == null ? "—" : "$" + v.toFixed(2); }
function selectedRows() {
  const year = document.getElementById("year").value;
  const region = document.getElementById("region").value;
  const fuel = document.getElementById("fuel").value;
  const income = document.getElementById("income").value;
  const subsidy = document.getElementById("subsidy").value;
  return rows.filter(r =>
    (year === "all" || String(r.year) === year) &&
    (region === "all" || r.region === region) &&
    (fuel === "all" || r.fuel_type === fuel) &&
    (income === "all" || r.income_group === income) &&
    (subsidy === "all" || r.subsidy_level === subsidy)
  );
}
function setOptions(id, values, label) {
  const el = document.getElementById(id), old = el.value;
  const valuesUnique = Array.from(new Set(values.filter(Boolean))).sort((a, b) => String(a).localeCompare(String(b), undefined, {numeric:true}));
  el.innerHTML = '<option value="all">' + label + '</option>' + valuesUnique.map(v => '<option value="' + esc(v) + '">' + esc(v) + '</option>').join("");
  if (valuesUnique.includes(old)) el.value = old;
}
function empty(el, text) { el.className = "chart"; el.innerHTML = '<div class="empty">' + esc(text) + '</div>'; }
function render() {
  const selected = selectedRows();
  const prices = selected.map(r => num(r, "retail_price_usd_per_liter")).filter(v => v !== null);
  const taxValues = selected.map(r => num(r, "tax_rate_pct")).filter(v => v !== null);
  const years = selected.map(r => num(r, "year")).filter(v => v !== null);
  document.getElementById("avg").textContent = money(mean(prices));
  document.getElementById("countries").textContent = selected.length ? new Set(selected.map(r => r.country).filter(Boolean)).size : "—";
  document.getElementById("tax").textContent = mean(taxValues) === null ? "—" : mean(taxValues).toFixed(1) + "%";
  document.getElementById("subsidies").textContent = selected.filter(r => r.subsidy_level || num(r, "subsidy_amount_usd_per_liter") !== null).length || "—";
  document.getElementById("records").textContent = selected.length.toLocaleString() + " records";
  document.getElementById("period").textContent = years.length ? Math.min(...years) + "–" + Math.max(...years) : "—";
  renderTrend(selected); renderBars(selected, "region", "regions", "No region values in this selection.");
  renderBars(selected, "income_group", "incomes", "No income group field in this source.");
  renderBars(selected, "subsidy_level", "subsidy-chart", "No subsidy level field in this source.");
  renderTax(selected); renderTable(selected);
}
function renderTrend(data) {
  const el = document.getElementById("trend"), groups = new Map();
  data.forEach(r => {
    const year = num(r, "year"), price = num(r, "retail_price_usd_per_liter");
    if (year !== null && price !== null) { if (!groups.has(year)) groups.set(year, []); groups.get(year).push(price); }
  });
  const values = Array.from(groups, ([year, prices]) => ({year, value:mean(prices)})).sort((a,b) => a.year-b.year);
  if (!values.length) { empty(el, "Load the cleaned CSV to see the year-by-year trend."); return; }
  el.className = "chart";
  const W=680,H=225,L=48,R=10,T=14,B=28,low=Math.min(...values.map(v=>v.value)),high=Math.max(...values.map(v=>v.value)),span=high-low||1;
  const X=i=>L+i*(W-L-R)/Math.max(values.length-1,1),Y=v=>T+(high-v)*(H-T-B)/span;
  let svg='<svg viewBox="0 0 '+W+' '+H+'" width="100%" height="100%" role="img" aria-label="Average fuel retail price by year">';
  for(let i=0;i<4;i++){const y=T+i*(H-T-B)/3, value=high-i*span/3;svg+='<line x1="'+L+'" y1="'+y+'" x2="'+(W-R)+'" y2="'+y+'" stroke="#e6edf4"/><text x="0" y="'+(y+4)+'" fill="#8997a8" font-size="10">$'+value.toFixed(2)+'</text>';}
  svg+='<polyline fill="none" stroke="#2876e8" stroke-width="3" stroke-linejoin="round" points="'+values.map((v,i)=>X(i)+","+Y(v.value)).join(" ")+'"/>';
  values.forEach((v,i)=>{svg+='<circle cx="'+X(i)+'" cy="'+Y(v.value)+'" r="4" fill="white" stroke="#2876e8" stroke-width="2"><title>'+v.year+': $'+v.value.toFixed(3)+'/L</title></circle><text x="'+X(i)+'" y="'+(H-5)+'" text-anchor="middle" fill="#8997a8" font-size="10">'+v.year+(v.year===2026?"*":"")+'</text>';});
  svg+='</svg><div class="chart-note">* 2026 data through April 6, 2026.</div>'; el.innerHTML=svg;
}
function renderBars(data, key, id, emptyText) {
  const el=document.getElementById(id), groups=new Map();
  data.forEach(r=>{const p=num(r,"retail_price_usd_per_liter");if(r[key]&&p!==null){if(!groups.has(r[key]))groups.set(r[key],[]);groups.get(r[key]).push(p);}});
  const values=Array.from(groups,([name,v])=>({name,value:mean(v)})).sort((a,b)=>b.value-a.value);
  if(!values.length){empty(el,emptyText);return;}
  const max=Math.max(...values.map(v=>v.value));el.className="chart region-bars";
  el.innerHTML=values.map(v=>'<div class="bar"><span class="bar-name" title="'+esc(v.name)+'">'+esc(v.name)+'</span><div class="track"><div class="fill" style="width:'+(100*v.value/max)+'%"></div></div><span class="bar-value">$'+v.value.toFixed(2)+'</span></div>').join("");
}
function renderTax(data) {
  const el=document.getElementById("tax-scatter");
  const focus=data.some(r=>r.fuel_type==="Petrol")?data.filter(r=>r.fuel_type==="Petrol"):data;
  const fuelName=focus.length?focus[0].fuel_type:"selected fuel";
  const pts=focus.map(r=>({x:num(r,"tax_rate_pct"),y:num(r,"retail_price_usd_per_liter"),country:r.country,date:r.date})).filter(p=>p.x!==null&&p.y!==null);
  if(!pts.length){empty(el,"Tax-versus-price view requires selected fuel prices and tax percentage.");return;}
  const sample=pts.length>1200?pts.filter((_,i)=>i%Math.ceil(pts.length/1200)===0):pts;
  const W=680,H=240,L=48,R=14,T=14,B=34,xmin=Math.min(...pts.map(p=>p.x)),xmax=Math.max(...pts.map(p=>p.x)),ymin=Math.min(...pts.map(p=>p.y)),ymax=Math.max(...pts.map(p=>p.y)),xs=xmax-xmin||1,ys=ymax-ymin||1;
  const X=v=>L+(v-xmin)*(W-L-R)/xs,Y=v=>T+(ymax-v)*(H-T-B)/ys;
  let svg='<svg viewBox="0 0 '+W+' '+H+'" width="100%" height="100%" role="img" aria-label="'+esc(fuelName)+' price versus tax percentage">';
  for(let i=0;i<4;i++){const y=T+i*(H-T-B)/3,val=ymax-i*ys/3;svg+='<line x1="'+L+'" y1="'+y+'" x2="'+(W-R)+'" y2="'+y+'" stroke="#e6edf4"/><text x="1" y="'+(y+4)+'" fill="#8997a8" font-size="10">$'+val.toFixed(1)+'</text>';}
  svg+='<line x1="'+L+'" y1="'+(H-B)+'" x2="'+(W-R)+'" y2="'+(H-B)+'" stroke="#cbd6e2"/><text x="'+(W/2)+'" y="'+(H-4)+'" text-anchor="middle" fill="#8997a8" font-size="10">Tax as share of retail price (%)</text>';
  sample.forEach(p=>{svg+='<circle cx="'+X(p.x)+'" cy="'+Y(p.y)+'" r="2.2" fill="#258e9c" fill-opacity=".35"><title>'+esc(p.country)+' '+esc(p.date)+': tax '+p.x+'%, '+esc(fuelName)+' $'+p.y+'/L</title></circle>';});
  svg+='</svg><div class="chart-note">'+esc(fuelName)+' observations; dots are sampled for readability. Descriptive association, not causal evidence.</div>';el.innerHTML=svg;
}
function renderTable(data) {
  const body=document.getElementById("body"),top=data.slice().sort((a,b)=>String(b.date||b.year).localeCompare(String(a.date||a.year))).slice(0,12);
  if(!top.length){body.innerHTML='<tr><td colspan="7" class="empty-row">Load the cleaned dataset from data/processed/fuel_prices_cleaned.csv.</td></tr>';return;}
  body.innerHTML=top.map(r=>'<tr><td>'+esc(r.country)+'</td><td>'+esc(r.region)+'</td><td>'+esc(r.fuel_type)+'</td><td>'+esc(r.date||r.year)+'</td><td>'+money(num(r,"retail_price_usd_per_liter"))+'</td><td>'+(num(r,"tax_rate_pct")===null?"—":num(r,"tax_rate_pct").toFixed(1)+"%")+'</td><td>'+esc(r.subsidy_level||"—")+'</td></tr>').join("");
}
function loadText(text,name) {
  const parsed=normalize(parseCSV(text));
  const required=["year","country","region","fuel_type","retail_price_usd_per_liter"];
  const missing=required.filter(k=>!Object.prototype.hasOwnProperty.call(parsed[0]||{},k));
  if(missing.length)throw new Error("Missing required columns: "+missing.join(", "));
  rows=parsed;
  setOptions("year",rows.map(r=>r.year),"All years");
  setOptions("region",rows.map(r=>r.region),"All regions");
  setOptions("fuel",rows.map(r=>r.fuel_type),"All types");
  setOptions("income",rows.map(r=>r.income_group),"All incomes");
  setOptions("subsidy",rows.map(r=>r.subsidy_level),"All subsidy levels");
  statusEl.textContent=rows.length.toLocaleString()+" rows · "+name;
  render();
}
fileInput.addEventListener("change",async e=>{
  const f=e.target.files[0];if(!f)return;
  try{loadText(await f.text(),f.name);}
  catch(err){rows=[];statusEl.textContent=err.message;render();}
});
["year","region","fuel","income","subsidy"].forEach(id=>document.getElementById(id).addEventListener("change",render));
document.getElementById("reset").addEventListener("click",()=>{
  ["year","region","fuel","income","subsidy"].forEach(id=>document.getElementById(id).value="all");
  render();
});
if(location.protocol==="http:"||location.protocol==="https:"){
  fetch("data/processed/fuel_prices_cleaned.csv").then(r=>{if(!r.ok)throw new Error("Processed CSV not found");return r.text();})
    .then(t=>loadText(t,"prepared dataset")).catch(()=>{});
}




