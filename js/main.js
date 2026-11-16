/* ═══════════════════════════════════════════════
   NOOLAM — interactions
   ═══════════════════════════════════════════════ */
"use strict";
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

/* ── toast + counters ─────────────────────────── */
let bag = 0, wish = 0;
function toast(html) {
  const t = $("#toast");
  t.innerHTML = html;
  t.classList.add("show");
  clearTimeout(t._tm);
  t._tm = setTimeout(() => t.classList.remove("show"), 2400);
}
function bumpBag() { bag++; $("#bagCount").textContent = bag; }
function bumpWish() { wish++; $("#wishCount").textContent = wish; }

/* ═══════════════════════════════════════════════
   GARMENT SVG GENERATOR (sarees & blouses on hangers)
   ═══════════════════════════════════════════════ */
const WOOD = "#9A6238", WOOD_D = "#7c4b28", HOOK = "#9c9c9c";

function folds(x0, x1, y0, y1, n, uid) {
  let s = `<g opacity="1">`;
  for (let i = 0; i < n; i++) {
    const x = x0 + ((x1 - x0) * i) / (n - 1);
    const dark = i % 2 ? 0.10 : 0.06;
    const w = i % 2 ? 8 : 5;
    s += `<path d="M${x} ${y0} C${x - 3} ${(y0 + y1) / 2} ${x - 5} ${y1 - 30} ${x - 6} ${y1}" stroke="rgba(60,20,20,${dark})" stroke-width="${w}" fill="none"/>`;
    if (i % 2 === 0) s += `<path d="M${x + 7} ${y0} C${x + 4} ${(y0 + y1) / 2} ${x + 2} ${y1 - 30} ${x + 1} ${y1}" stroke="rgba(255,255,255,${0.07})" stroke-width="4" fill="none"/>`;
  }
  return s + `</g>`;
}

function patternDef(item, uid) {
  const { accent, pattern } = item.c;
  if (pattern === "check")
    return `<pattern id="p${uid}" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M0 10 H20 M10 0 V20" stroke="${accent}" stroke-width="5" opacity=".5"/>
    </pattern>`;
  if (pattern === "brocade")
    return `<pattern id="p${uid}" width="17" height="17" patternUnits="userSpaceOnUse">
      <circle cx="8.5" cy="8.5" r="2.4" fill="${accent}" opacity=".75"/>
      <circle cx="0" cy="0" r="1.2" fill="${accent}" opacity=".5"/>
      <circle cx="17" cy="17" r="1.2" fill="${accent}" opacity=".5"/>
      <circle cx="17" cy="0" r="1.2" fill="${accent}" opacity=".5"/>
      <circle cx="0" cy="17" r="1.2" fill="${accent}" opacity=".5"/>
    </pattern>`;
  if (pattern === "stripes")
    return `<pattern id="p${uid}" width="14" height="14" patternUnits="userSpaceOnUse">
      <rect width="14" height="14" fill="${accent}" opacity=".22"/>
    </pattern>`;
  return "";
}

/* cloth silhouette: saree */
const SAREE_D = "M47 49 C41 92 34 152 31 204 Q31 215 43 213 C62 209 79 215 100 213 C121 211 139 215 157 213 Q169 215 169 204 C166 152 159 92 153 49 Z";
/* half saree: skirt + thavani */
const SKIRT_D = "M52 49 C47 82 41 112 39 142 Q39 151 49 150 C67 147 83 151 100 150 C117 149 133 151 151 150 Q161 151 161 142 C159 112 153 82 148 49 Z";
const THAV_D  = "M57 151 C53 176 50 196 49 212 Q49 221 60 219 C76 215 90 221 101 219 C117 217 130 221 145 219 Q156 221 156 212 C154 196 151 176 148 151 Z";
/* blouse: body + sleeves */
const BLOUSE_D = "M64 50 C60 58 56 70 56 88 L58 136 Q58 146 68 146 L132 146 Q142 146 142 136 L144 88 C144 70 140 58 136 50 Z";
const SLV_HALF_L = "M64 50 C51 54 43 62 41 80 L52 90 C56 76 61 64 68 57 Z";
const SLV_HALF_R = "M136 50 C149 54 157 62 159 80 L148 90 C144 76 139 64 132 57 Z";
const SLV_FULL_L = "M64 50 C48 56 40 68 38 96 L48 112 C54 92 60 70 68 58 Z";
const SLV_FULL_R = "M136 50 C152 56 160 68 162 96 L152 112 C146 92 140 70 132 58 Z";

function hangerParts() {
  return `<path d="M100 26 V15 C100 7 90.5 7.5 90.5 13.5" fill="none" stroke="${HOOK}" stroke-width="3.4" stroke-linecap="round"/>
  <path d="M100 26 L46 49 M100 26 L154 49" stroke="${WOOD}" stroke-width="7" stroke-linecap="round"/>
  <path d="M100 26 L46 49 M100 26 L154 49" stroke="${WOOD_D}" stroke-width="2.4" stroke-linecap="round" opacity=".5" transform="translate(0,1.6)"/>`;
}

function garmentSVG(item, uid) {
  const c = item.c;
  const p = patternDef(item, uid);
  let cloth = "", extra = "";
  if (item.type === "saree") {
    cloth = `<g clip-path="url(#cp${uid})">
      <rect x="20" y="40" width="160" height="185" fill="${c.base}"/>
      ${c.pattern !== "plain" ? `<rect x="20" y="40" width="160" height="185" fill="url(#p${uid})"/>` : ""}
      ${folds(56, 146, 55, 208, 8, uid)}
      <rect x="20" y="${c.pattern === "brocade" ? 178 : 186}" width="160" height="${c.pattern === "brocade" ? 36 : 28}" fill="${c.border}" opacity=".92"/>
      <rect x="20" y="${c.pattern === "brocade" ? 178 : 186}" width="160" height="4" fill="rgba(255,255,255,.35)"/>
    </g>
    <path d="${SAREE_D}" fill="none" stroke="rgba(40,10,15,.18)" stroke-width="1.4"/>`;
  } else if (item.type === "halfsaree") {
    cloth = `<g clip-path="url(#cp${uid})">
      <rect x="20" y="40" width="160" height="115" fill="${c.base}"/>
      ${c.pattern !== "plain" ? `<rect x="20" y="40" width="160" height="115" fill="url(#p${uid})"/>` : ""}
      ${folds(58, 144, 55, 148, 6, uid)}
      <rect x="20" y="138" width="160" height="14" fill="${c.border}" opacity=".9"/>
      <rect x="20" y="152" width="160" height="72" fill="${c.accent}"/>
      ${folds(60, 142, 155, 218, 6, uid)}
      <rect x="20" y="206" width="160" height="16" fill="${c.border}" opacity=".92"/>
    </g>
    <path d="${SKIRT_D}" fill="none" stroke="rgba(40,10,15,.16)" stroke-width="1.3"/>
    <path d="${THAV_D}" fill="none" stroke="rgba(40,10,15,.16)" stroke-width="1.3"/>`;
  } else {
    const slvL = item.sleeve === "full" ? SLV_FULL_L : SLV_HALF_L;
    const slvR = item.sleeve === "full" ? SLV_FULL_R : SLV_HALF_R;
    const hemY = 146;
    cloth = `<g clip-path="url(#cp${uid})">
      <rect x="30" y="40" width="140" height="112" fill="${c.base}"/>
      ${c.pattern !== "plain" ? `<rect x="30" y="40" width="140" height="112" fill="url(#p${uid})"/>` : ""}
      ${folds(72, 130, 55, 144, 4, uid)}
      <rect x="30" y="${hemY - 6}" width="140" height="7" fill="${c.border}" opacity=".85"/>
      <path d="${slvL}" fill="${c.base}" stroke="rgba(40,10,15,.16)" stroke-width="1.2"/>
      <path d="${slvR}" fill="${c.base}" stroke="rgba(40,10,15,.16)" stroke-width="1.2"/>
      ${item.sleeve === "full"
        ? `<path d="M38 96 L48 112 M162 96 L152 112" stroke="${c.border}" stroke-width="5" opacity=".85"/>`
        : `<path d="M41 80 L52 90 M159 80 L148 90" stroke="${c.border}" stroke-width="4" opacity=".85"/>`}
      <path d="M84 50 C90 57 110 57 116 50" stroke="rgba(30,8,12,.35)" stroke-width="3.4" fill="none"/>
      <circle cx="100" cy="80" r="1.8" fill="rgba(30,8,12,.3)"/><circle cx="100" cy="95" r="1.8" fill="rgba(30,8,12,.3)"/>
      <circle cx="100" cy="110" r="1.8" fill="rgba(30,8,12,.3)"/><circle cx="100" cy="125" r="1.8" fill="rgba(30,8,12,.3)"/>
    </g>
    <path d="${BLOUSE_D}" fill="none" stroke="rgba(40,10,15,.18)" stroke-width="1.4"/>`;
  }
  return `<svg viewBox="0 0 200 260" aria-hidden="true">
    <defs>
      <clipPath id="cp${uid}"><path d="${item.type === "saree" ? SAREE_D : item.type === "halfsaree" ? SKIRT_D + " " + THAV_D : BLOUSE_D + " " + SLV_HALF_L + " " + SLV_HALF_R}"/></clipPath>
      ${p}
    </defs>
    ${cloth}
    ${hangerParts()}
  </svg>`;
}

/* ═══════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════ */
/* ── rack items (25 unique) ── */
const RACK = [
  { id: 1,  name: "NOOLAM TEMPLE GOLD BROCADE",   price: 32000, type: "saree",     tags: ["silk", "zari"],    c: { base: "#C4A03A", accent: "#8f6b1d", border: "#E3C46B", pattern: "brocade" } },
  { id: 2,  name: "NOOLAM ARAKKU ROSE SILK",      price: 28500, type: "saree",     tags: ["silk"],            c: { base: "#7E2237", accent: "#5a1424", border: "#D9A94E", pattern: "plain" } },
  { id: 3,  name: "NOOLAM MIDNIGHT ZARI KANCHI",  price: 36000, type: "saree",     tags: ["silk", "zari"],    c: { base: "#20388E", accent: "#C99B3F", border: "#E3C46B", pattern: "plain" } },
  { id: 4,  name: "NOOLAM IVORY SANDAL SILK",     price: 24000, type: "saree",     tags: ["silk"],            c: { base: "#EFE4CB", accent: "#c8b184", border: "#C99B3F", pattern: "plain" } },
  { id: 5,  name: "NOOLAM RANI PINK PALLU",       price: 30200, type: "saree",     tags: ["silk"],            c: { base: "#C02561", accent: "#8f1746", border: "#E3C46B", pattern: "stripes" } },
  { id: 6,  name: "NOOLAM THANDAVALAM CHECK",     price: 19900, type: "saree",     tags: ["silk", "checked"], c: { base: "#C8892B", accent: "#7e4a12", border: "#D9A94E", pattern: "check" } },
  { id: 7,  name: "NOOLAM KAZHUNI KATTAM RED",    price: 18600, type: "saree",     tags: ["silk", "checked"], c: { base: "#B02734", accent: "#5f1017", border: "#D9A94E", pattern: "check" } },
  { id: 8,  name: "NOOLAM THALAIVANA GREEN KATTAM", price: 21400, type: "saree",   tags: ["silk", "checked"], c: { base: "#2C7A4B", accent: "#143c24", border: "#D9A94E", pattern: "check" } },
  { id: 9,  name: "NOOLAM KATTAM ROSE",           price: 16800, type: "saree",     tags: ["checked"],         c: { base: "#C4507C", accent: "#6e2140", border: "#E3C46B", pattern: "check" } },
  { id: 10, name: "NOOLAM NEELAM BLUE KATTAM",    price: 17900, type: "saree",     tags: ["checked"],         c: { base: "#3E5FA8", accent: "#1d2f5c", border: "#D9A94E", pattern: "check" } },
  { id: 11, name: "NOOLAM MANGAI MAROON SILK",    price: 26800, type: "saree",     tags: ["silk"],            c: { base: "#6E1220", accent: "#4a0b13", border: "#E3C46B", pattern: "plain" } },
  { id: 12, name: "NOOLAM PATTU PAVADAI ROSE",    price: 14500, type: "halfsaree", tags: ["half"],            c: { base: "#C95C86", accent: "#E3C46B", border: "#D9A94E", pattern: "plain" } },
  { id: 13, name: "NOOLAM MANJAL PAVADAI",        price: 13200, type: "halfsaree", tags: ["half"],            c: { base: "#D9A62B", accent: "#8C1D2C", border: "#E3C46B", pattern: "plain" } },
  { id: 14, name: "NOOLAM VAAN BLUE HALF",        price: 15400, type: "halfsaree", tags: ["half"],            c: { base: "#2E4C9A", accent: "#9FB6DF", border: "#D9A94E", pattern: "plain" } },
  { id: 15, name: "NOOLAM THAMARAI LOTUS HALF",   price: 16000, type: "halfsaree", tags: ["half"],            c: { base: "#D46A9E", accent: "#8C2B55", border: "#E3C46B", pattern: "stripes" } },
  { id: 16, name: "NOOLAM SAFFRON RAW SILK BLOUSE", price: 3600, type: "blouse", sleeve: "full", tags: ["fullb"], c: { base: "#D98E2B", accent: "#a5641a", border: "#C99B3F", pattern: "plain" } },
  { id: 17, name: "NOOLAM ROSE PINK SILK BLOUSE", price: 4200,  type: "blouse", sleeve: "full", tags: ["fullb"], c: { base: "#C2497B", accent: "#8e2f56", border: "#E3C46B", pattern: "plain" } },
  { id: 18, name: "NOOLAM GREEN BROCADE BLOUSE",  price: 5400,  type: "blouse", sleeve: "full", tags: ["fullb", "zari"], c: { base: "#256B45", accent: "#C99B3F", border: "#C99B3F", pattern: "brocade" } },
  { id: 19, name: "NOOLAM ARAKKU VELVET BLOUSE",  price: 6200,  type: "blouse", sleeve: "full", tags: ["fullb"], c: { base: "#5E1526", accent: "#3d0c19", border: "#D9A94E", pattern: "plain" } },
  { id: 20, name: "NOOLAM DUSTY ROSE SILK BLOUSE", price: 4200, type: "blouse", sleeve: "half", tags: ["halfb"], c: { base: "#C96A85", accent: "#93405a", border: "#E3C46B", pattern: "plain" } },
  { id: 21, name: "NOOLAM TEAL TEMPLE BLOUSE",    price: 4800,  type: "blouse", sleeve: "half", tags: ["halfb"], c: { base: "#1F6E6A", accent: "#0e4541", border: "#C99B3F", pattern: "plain" } },
  { id: 22, name: "NOOLAM OCHRE COTTON BLOUSE",   price: 2900,  type: "blouse", sleeve: "half", tags: ["halfb"], c: { base: "#C79A3B", accent: "#8a671d", border: "#b3873a", pattern: "plain" } },
  { id: 23, name: "NOOLAM PINK STONE SILK BLOUSE", price: 3800, type: "blouse", sleeve: "half", tags: ["halfb"], c: { base: "#D77FA6", accent: "#a34d72", border: "#E3C46B", pattern: "stripes" } },
  { id: 24, name: "NOOLAM SEA GREEN SILK BLOUSE", price: 3400,  type: "blouse", sleeve: "half", tags: ["halfb"], c: { base: "#6FA087", accent: "#3f6e56", border: "#C99B3F", pattern: "plain" } },
  { id: 25, name: "NOOLAM MAROON ZARI BLOUSE",    price: 5900,  type: "blouse", sleeve: "half", tags: ["halfb"], c: { base: "#7E1E31", accent: "#C99B3F", border: "#C99B3F", pattern: "stripes" } },
  { id: 26, name: "NOOLAM LAVENDER SILK BLOUSE",  price: 4400,  type: "blouse", sleeve: "half", tags: ["halfb"], c: { base: "#A08BC0", accent: "#6e5a8e", border: "#E3C46B", pattern: "plain" } },
  { id: 27, name: "NOOLAM GREY BLUE COTTON BLOUSE", price: 3100, type: "blouse", sleeve: "half", tags: ["halfb"], c: { base: "#7C93A8", accent: "#4f6478", border: "#b3a276", pattern: "plain" } },
];

const CATS = [
  { key: "all",    label: "All pieces" },
  { key: "silk",   label: "Silk Sarees" },
  { key: "half",   label: "Half Sarees" },
  { key: "fullb",  label: "Full-Sleeve Blouses" },
  { key: "halfb",  label: "Half-Sleeve Blouses" },
  { key: "checked",label: "Checked Sarees" },
  { key: "zari",   label: "Zari & Brocade" },
];
const fmt = n => "₹" + n.toLocaleString("en-IN") + ".00";

/* ── rack render ──────────────────────────────── */
let activeCat = "silk", uidSeq = 0;
function catItems(key) {
  return key === "all" ? RACK : RACK.filter(i => i.tags.includes(key));
}
function renderChips() {
  $("#rackChips").innerHTML = CATS.map(c =>
    `<button class="chip${c.key === activeCat ? " active" : ""}" data-cat="${c.key}">${c.label}<span class="cnt">${catItems(c.key).length}</span></button>`
  ).join("");
  $$("#rackChips .chip").forEach(ch => ch.addEventListener("click", () => {
    if (ch.dataset.cat === activeCat) return;
    activeCat = ch.dataset.cat;
    renderChips();
    filterRail();
  }));
}
function filterRail() {
  const items = catItems(activeCat);
  const rail = $("#rail");
  $$(".hanger", rail).forEach(h => h.classList.add("leaving"));
  setTimeout(() => {
    const n = items.length;
    const w = n > 14 ? 86 : n > 10 ? 100 : 118;
    const m = n > 14 ? -30 : n > 10 ? -22 : -14;
    rail.innerHTML = items.map(it =>
      `<div class="hanger" data-id="${it.id}" style="width:${w}px;margin:0 ${m}px;animation-delay:${Math.random() * .25}s">${garmentSVG(it, "r" + it.id)}</div>`
    ).join("");
    $("#rackCountLeft").textContent = `EXPLORE THE COLLECTION · ${n} PIECES`;
    bindHangers();
  }, 280);
}
function bindHangers() {
  $$(".hanger").forEach(h => {
    const it = RACK.find(r => r.id === +h.dataset.id);
    h.addEventListener("mouseenter", () => {
      $("#railCaption").innerHTML = `<b>${it.name}</b><span>·</span><span>${fmt(it.price)}</span>`;
    });
    h.addEventListener("mouseleave", () => {
      $("#railCaption").innerHTML = "";
    });
    h.addEventListener("click", () => openRackOverlay(it));
  });
}

/* ── rack detail overlay ──────────────────────── */
let ovItem = null, ovList = [], ovSide = "front", ovSize = null;
function openRackOverlay(item) {
  ovItem = item;
  ovList = catItems(activeCat);
  ovSide = "front"; ovSize = null;
  $("#rackOverlay").hidden = false;
  document.body.style.overflow = "hidden";
  paintOverlay();
  paintBlur();
}
function paintOverlay() {
  const flip = ovSide === "back" ? ' style="transform:scaleX(-1)"' : "";
  $("#ovGarment").innerHTML = `<div${flip}>${garmentSVG(ovItem, "ov" + ovItem.id + ovSide)}</div>`;
  $("#ovName").textContent = ovItem.name;
  $("#ovPrice").textContent = fmt(ovPrice(ovItem));
  $$(".ov-toggle button").forEach(b => b.classList.toggle("active", b.dataset.side === ovSide));
  $("#ovSelect").classList.remove("ready");
  $("#ovSelect").disabled = true;
  $("#ovSelect").textContent = "SELECT A SIZE";
  $$("#ovSizes button").forEach(b => b.classList.remove("sel"));
}
const ovPrice = it => it.price;
function paintBlur() {
  const n = ovList.length;
  const w = n > 14 ? 120 : n > 10 ? 140 : 170;
  $("#overlayBlur").innerHTML = `<div style="display:flex;justify-content:center;align-items:center;height:100%;gap:0;padding-top:120px">
    ${ovList.map(it => `<div style="width:${w}px;margin:0 -${w * 0.16}px;flex:none;opacity:.85">${garmentSVG(it, "b" + it.id)}</div>`).join("")}
  </div>`;
}
function ovStep(dir) {
  const idx = ovList.findIndex(i => i.id === ovItem.id);
  ovItem = ovList[(idx + dir + ovList.length) % ovList.length];
  ovSide = "front"; ovSize = null;
  paintOverlay();
}
function closeRackOverlay() {
  $("#rackOverlay").hidden = true;
  document.body.style.overflow = "";
}

/* ═══════════════════════════════════════════════
   TRY THE LOOK
   ═══════════════════════════════════════════════ */
const LOOKS = [
  { name: "Emerald Kanjivaram", img: "assets/img/look1.jpg", saree: { n: "Emerald Kanjivaram with Mayil Border", p: 28400 }, blouse: { n: "Deep Green Silk Blouse", p: 4600 } },
  { name: "Rani Pink Kanjivaram", img: "assets/img/look2.jpg", saree: { n: "Rani Pink Kanjivaram with Velli Border", p: 30600 }, blouse: { n: "Rani Pink Silk Blouse", p: 4200 } },
  { name: "Royal Blue Banarasi", img: "assets/img/look3.jpg", saree: { n: "Royal Blue Banarasi with Gold Zari", p: 34200 }, blouse: { n: "Teal Temple Blouse", p: 4800 } },
  { name: "Ivory Pearl", img: "assets/img/look4.jpg", saree: { n: "Ivory Pearl Kanjivaram with Rudraksha Border", p: 32800 }, blouse: { n: "Saffron Raw Silk Blouse", p: 3600 } },
  { name: "Sandal Paste Ivory", img: "assets/img/look5.jpg", saree: { n: "Sandal Paste Ivory Kanjivaram", p: 29600 }, blouse: { n: "Dusty Rose Silk Blouse", p: 4200 } },
  { name: "Arakku Rose", img: "assets/img/look6.jpg", saree: { n: "Arakku Rose Kanjivaram with Annam Border", p: 31400 }, blouse: { n: "Arakku Velvet Blouse", p: 6200 } },
  { name: "Ivory Elephant", img: "assets/img/look7.jpg", saree: { n: "Ivory Kanjivaram with Elephant Border", p: 32000 }, blouse: { n: "Dusty Rose Silk Blouse", p: 4200 } },
  { name: "Temple Gold Kanjivaram", img: "assets/img/look8.jpg", saree: { n: "Temple Gold Kanjivaram with Brocade Pallu", p: 36400 }, blouse: { n: "Green Brocade Blouse", p: 5400 } },
];
const JEWELS = [
  { cat: "CHOKER",    n: "Pink Stone Temple Choker",    p: 9400,  thumb: "assets/img/thumb-choker.jpg" },
  { cat: "JHUMKAS",   n: "Jhumkas with Pearl Drops",    p: 4600,  thumb: "assets/img/thumb-jhumka.jpg" },
  { cat: "OTTIYANAM", n: "Elephant Motif Ottiyanam",    p: 15000, thumb: "assets/img/thumb-ottiyanam.jpg" },
  { cat: "BANGLES",   n: "Gold and Dusty Rose Bangle Stack", p: 3800, thumb: "assets/img/thumb-bangles.jpg" },
];
function renderLooks() {
  $("#tlTrack").innerHTML = LOOKS.map(l =>
    `<div class="look-card" data-name="${l.name}"><img src="${l.img}" alt="${l.name}" draggable="false"></div>`
  ).join("");
}
let tlActive = 6; // "7 of 8 · Ivory Elephant"
function paintTL() {
  const cards = $$("#tlTrack .look-card");
  cards.forEach((c, i) => c.classList.toggle("center", i === tlActive));
  const l = LOOKS[tlActive];
  $("#tlIndex").textContent = tlActive + 1;
  $("#tlName").textContent = l.name;
  const items = [
    { cat: "SAREE",  ...l.saree,  thumb: "assets/img/thumb-saree.jpg" },
    { cat: "BLOUSE", ...l.blouse, thumb: "assets/img/thumb-blouse.jpg" },
    ...JEWELS,
  ];
  $("#tlItems").innerHTML = items.map((it, i) =>
    `<div class="tl-item">
      <span class="tl-thumb"><img src="${it.thumb}" alt=""><i>${i + 1}</i></span>
      <span class="tl-item-info"><em>NOOLAM · ${it.cat}</em><b>${it.n}</b><span>₹${it.p.toLocaleString("en-IN")}</span></span>
      <button class="tl-mini wish" aria-label="Wishlist"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 20.5s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.9c0 5.4-7.5 10-7.5 10Z"/></svg></button>
      <button class="tl-mini plus" aria-label="Add"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></button>
    </div>`).join("");
  const total = items.reduce((s, i) => s + i.p, 0);
  $("#tlWas").textContent = "₹" + total.toLocaleString("en-IN");
  $("#tlNow").textContent = "₹" + Math.round(total * 0.9).toLocaleString("en-IN");
  $$("#tlItems .tl-mini.wish").forEach(b => b.addEventListener("click", () => { bumpWish(); toast("Saved to your <b>wishlist</b>"); }));
  $$("#tlItems .tl-mini.plus").forEach(b => b.addEventListener("click", () => { bumpBag(); toast("Added to your <b>bag</b>"); }));
}
function tlGo(i, instant = false) {
  tlActive = Math.max(0, Math.min(LOOKS.length - 1, i));
  const track = $("#tlTrack");
  const card = track.children[tlActive];
  track.scrollTo({ left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2, behavior: instant ? "auto" : "smooth" });
  paintTL();
}
function bindTL() {
  const track = $("#tlTrack");
  let down = false, startX = 0, startScroll = 0, moved = 0;
  track.addEventListener("pointerdown", e => {
    down = true; moved = 0; startX = e.clientX; startScroll = track.scrollLeft;
    track.classList.add("grabbing");
  });
  window.addEventListener("pointermove", e => {
    if (!down) return;
    const dx = e.clientX - startX;
    moved = Math.max(moved, Math.abs(dx));
    track.scrollLeft = startScroll - dx;
  });
  window.addEventListener("pointerup", () => { down = false; track.classList.remove("grabbing"); });
  let raf = null;
  track.addEventListener("scroll", () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = null;
      const rect = track.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      let best = 0, bd = 1e9;
      $$("#tlTrack .look-card").forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - cx);
        if (d < bd) { bd = d; best = i; }
      });
      if (best !== tlActive) { tlActive = best; paintTL(); }
      const p = tlActive / (LOOKS.length - 1);
      $("#tlProgFill").style.left = (p * 75) + "%";
    });
  });
  $("#tlPrev").addEventListener("click", () => tlGo(tlActive - 1));
  $("#tlNext").addEventListener("click", () => tlGo(tlActive + 1));
  $("#tlAddBag").addEventListener("click", () => { bumpBag(); toast("Full look added to your <b>bag</b> — 10% off applied"); });
}

/* ═══════════════════════════════════════════════
   PICK A SILK
   ═══════════════════════════════════════════════ */
const SILKS = [
  { t: "Korvai Check",        p: 18800, bg: "#1E9E5A", img: "assets/img/reel1.jpg",         dark: false },
  { t: "Magenta Shadow Silk", p: 29800, bg: "#7A2FA0", img: "assets/img/mood-zari.jpg",     dark: false },
  { t: "Palace Check",        p: 19900, bg: "#B02036", img: "assets/img/look6.jpg",         dark: false },
  { t: "Bengal Garden",       p: 24600, bg: "#F0A72B", img: "assets/img/look4.jpg",         dark: true },
  { t: "Kanchi Rani",         p: 32400, bg: "#C81F3E", img: "assets/img/bridal4.jpg",       dark: false },
  { t: "Benares Gold",        p: 41800, bg: "#E9B62A", img: "assets/img/bridal7.jpg",       dark: true },
  { t: "Arakku Rose",         p: 27600, bg: "#D96A2B", img: "assets/img/mood-festive.jpg",  dark: false },
];
function renderSilks() {
  $("#silkStrip").innerHTML = SILKS.map((s, i) => {
    const rot = ((i - 3) * 2.4).toFixed(1);
    const dy = (Math.abs(i - 3) * 16).toFixed(0);
    return `<div class="silk-card${s.dark ? " dark-title" : ""}" data-i="${i}" style="background:${s.bg};--rot:${rot}deg;--dy:${dy}px">
      <h4>${s.t.replace(" ", "<br>")}</h4>
      <img class="silk-card-img" src="${s.img}" alt="${s.t}" draggable="false">
      <span class="silk-price">₹${s.p.toLocaleString("en-IN")}</span>
      <button class="silk-heart" aria-label="Wishlist"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 20.5s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.9c0 5.4-7.5 10-7.5 10Z"/></svg></button>
      <button class="silk-plus" aria-label="Add to bag">+</button>
    </div>`;
  }).join("");
  $$(".silk-card").forEach(card => {
    const i = +card.dataset.i;
    const base = `rotate(${((i - 3) * 2.4).toFixed(1)}deg) translateY(${(Math.abs(i - 3) * 16).toFixed(0)}px)`;
    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) ${base} rotateY(${x * 14}deg) rotateX(${-y * 10}deg)`;
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    $(".silk-plus", card).addEventListener("click", e => {
      e.stopPropagation();
      bumpBag();
      toast(`<b>${SILKS[i].t}</b> dropped into your bag`);
    });
    $(".silk-heart", card).addEventListener("click", e => {
      e.stopPropagation();
      bumpWish();
      toast(`<b>${SILKS[i].t}</b> saved to wishlist`);
    });
  });
}

/* ═══════════════════════════════════════════════
   MUSE FILM
   ═══════════════════════════════════════════════ */
function bindFilm() {
  $("#filmPlay").addEventListener("click", () => {
    $("#filmFrame").classList.add("playing");
    toast("Playing <b>The Muse Film</b>");
  });
  $("#filmSound").addEventListener("click", () => {
    const on = $("#filmSound").textContent.trim() === "SOUND OFF";
    $("#filmSound").textContent = on ? "SOUND ON" : "SOUND OFF";
  });
}

/* ═══════════════════════════════════════════════
   MUSE REELS
   ═══════════════════════════════════════════════ */
const REELS = [
  { n: "01", dur: "0:16", fabric: "TISSUE KANJIVARAM", t: "Ponni Kanjivaram", loc: "Lamp room, Kanchipuram", img: "assets/img/reel7.jpg" },
  { n: "02", dur: "0:31", fabric: "HAND-BLOCK COTTON", t: "Marina Morning", loc: "Mylapore to the sea", img: "assets/img/reel8.jpg" },
  { n: "03", dur: "0:17", fabric: "BANARASI KATAN", t: "Kaali Banarasi", loc: "Studio, Varanasi red", img: "assets/img/reel4.jpg" },
  { n: "04", dur: "0:15", fabric: "KANJIVARAM SILK", t: "Pachai Pattu", loc: "The bride's chamber", img: "assets/img/reel5.jpg" },
  { n: "05", dur: "0:38", fabric: "GEORGETTE SILK", t: "Galli Sindoor", loc: "Old-city lanes", img: "assets/img/reel6.jpg" },
  { n: "06", dur: "0:22", fabric: "KANJIVARAM SILK", t: "Arakku Evening", loc: "Terrace at dusk", img: "assets/img/reel2.jpg" },
  { n: "07", dur: "0:28", fabric: "TISSUE KANJIVARAM", t: "Mullai Malligai", loc: "Courtyard morning", img: "assets/img/reel3.jpg" },
  { n: "08", dur: "0:19", fabric: "GEORGETTE SILK", t: "Velli Gold", loc: "Temple corridor", img: "assets/img/reel1.jpg" },
];
let reelActive = 3, reelTimer = null, reelPlaying = true;
function renderReels() {
  $("#reelArc").innerHTML = REELS.map((r, i) =>
    `<div class="reel-card" data-i="${i}">
      <img src="${r.img}" alt="${r.t}" draggable="false">
      <div class="reel-top"><span class="reel-num"><i class="${i === 3 ? "red" : ""}"></i>REEL ${r.n}</span><span class="reel-dur">${r.dur}</span></div>
      <div class="reel-play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5-11-6.5Z"/></svg></div>
      <div class="reel-meta"><em>${r.fabric}</em><b>${r.t}</b><span>${r.loc}</span></div>
      <div class="reel-progress"><i></i></div>
    </div>`).join("");
  paintReels();
  bindReels();
}
function paintReels() {
  const n = REELS.length;
  $$(".reel-card").forEach((card, i) => {
    let off = i - reelActive;
    if (off > n / 2) off -= n;
    if (off < -n / 2) off += n;
    const az = Math.abs(off);
    const x = off * 195, z = -az * 165, ry = off * -26;
    card.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${ry}deg) scale(${1 - az * 0.045})`;
    card.style.zIndex = String(50 - az);
    card.style.opacity = az > 3.4 ? 0 : String(1 - az * 0.17);
    card.style.filter = az === 0 ? "none" : `saturate(${1 - az * 0.14})`;
    card.style.pointerEvents = az > 3 ? "none" : "auto";
    $(".reel-play", card).style.display = az === 0 ? "flex" : "none";
    $(".reel-progress", card).classList.toggle("pulse", az === 0 && reelPlaying);
  });
}
function bindReels() {
  $("#reelPrev").addEventListener("click", () => { reelActive = (reelActive - 1 + REELS.length) % REELS.length; paintReels(); });
  $("#reelNext").addEventListener("click", () => { reelActive = (reelActive + 1) % REELS.length; paintReels(); });
  $("#reelPause").addEventListener("click", () => {
    reelPlaying = !reelPlaying;
    $("#reelPauseIcon").innerHTML = reelPlaying ? '<path d="M8 5h3v14H8zM13 5h3v14h-3z"/>' : '<path d="M8 5.5v13l11-6.5-11-6.5Z"/>';
    paintReels();
  });
  $$(".reel-card").forEach(card => card.addEventListener("click", () => {
    const i = +card.dataset.i;
    if (i === reelActive) openReelFull(i);
    else { reelActive = i; paintReels(); }
  }));
  reelTimer = setInterval(() => {
    if (!reelPlaying) return;
    reelActive = (reelActive + 1) % REELS.length;
    paintReels();
  }, 3200);
}
function openReelFull(i) {
  const r = REELS[i];
  $("#reelFullImg").src = r.img;
  $("#reelFullFabric").textContent = r.fabric + " · " + r.dur;
  $("#reelFullTitle").textContent = r.t;
  $("#reelFullLoc").textContent = r.loc;
  $("#reelFullBar").style.animation = "reelBar 8s linear infinite";
  $("#reelFull").hidden = false;
  document.body.style.overflow = "hidden";
}

/* ═══════════════════════════════════════════════
   BRIDAL
   ═══════════════════════════════════════════════ */
const BRIDALS = [
  { n: "Vaibhogam Deep Red",   meta: "Pattu · Peacock-nelli pallu",  p: 34500, disc: "-8%",  img: "assets/img/bridal1.jpg" },
  { n: "Seethanam Bridal Red", meta: "Pattu · Gold zari checks",     p: 38200, disc: "-10%", img: "assets/img/bridal2.jpg" },
  { n: "Kurinji Flowers Pattu",meta: "Pattu · Flower-embroidered pallu", p: 29800, img: "assets/img/bridal3.jpg" },
  { n: "Manjal Kalyanam Pattu",meta: "Pattu · Red-gold pallu",       p: 27300, img: "assets/img/bridal4.jpg" },
  { n: "Pandu Varisai Green",  meta: "Pattu · Temple-border pallu",  p: 31600, disc: "-10%", img: "assets/img/bridal5.jpg" },
  { n: "Ilai Maroon Legacy",   meta: "Pattu · Rudraksha border",     p: 36900, disc: "-5%",  img: "assets/img/bridal6.jpg" },
  { n: "Sindooram Heritage",   meta: "Pattu · Classic arakku pallu", p: 33400, img: "assets/img/bridal7.jpg" },
];
let bridalActive = 3;
function renderBridal() {
  $("#bridalStage").innerHTML = BRIDALS.map((b, i) =>
    `<div class="bridal-card" data-i="${i}"><img src="${b.img}" alt="${b.n}" draggable="false">${b.disc ? `<span class="disc">${b.disc}</span>` : ""}</div>`
  ).join("");
  paintBridal();
  $("#bridalPrev").addEventListener("click", () => { bridalActive = (bridalActive - 1 + BRIDALS.length) % BRIDALS.length; paintBridal(); });
  $("#bridalNext").addEventListener("click", () => { bridalActive = (bridalActive + 1) % BRIDALS.length; paintBridal(); });
  $("#bridalAdd").addEventListener("click", () => { bumpBag(); toast(`<b>${BRIDALS[bridalActive].n}</b> added to cart`); });
  $("#bridalWish").addEventListener("click", () => { bumpWish(); toast("Saved to your <b>wishlist</b>"); });
  $$(".bridal-card").forEach(c => c.addEventListener("click", () => {
    const i = +c.dataset.i;
    if (i !== bridalActive) { bridalActive = i; paintBridal(); }
  }));
}
function paintBridal() {
  $$(".bridal-card").forEach((card, i) => {
    const off = i - bridalActive;
    const az = Math.abs(off);
    card.style.transform = `translateX(${off * 262}px) translateZ(${-az * 130}px) rotateY(${off * -20}deg) scale(${1 - az * 0.03})`;
    card.style.zIndex = String(40 - az);
    card.style.opacity = az > 2.8 ? 0 : String(1 - az * 0.22);
    card.classList.toggle("center", off === 0);
    card.style.pointerEvents = az > 2 ? "none" : "auto";
  });
  const b = BRIDALS[bridalActive];
  $("#bridalName").textContent = b.n;
  $("#bridalMeta").textContent = b.meta;
  $("#bridalPrice").textContent = "₹" + b.p.toLocaleString("en-IN");
}

/* ═══════════════════════════════════════════════
   NAV + REVEAL
   ═══════════════════════════════════════════════ */
function bindNav() {
  const secs = ["home", "try-the-look", "pick-a-silk", "the-rack", "the-muse", "bridal"];
  const links = $$(".nav-links a");
  window.addEventListener("scroll", () => {
    let cur = "home";
    secs.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top < window.innerHeight * 0.45) cur = id;
    });
    links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + cur));
  }, { passive: true });
}
function bindReveal() {
  const targets = $$(".section-head, .moods-grid, .tl-stage, .tl-panel, .silk-strip, .rail-zone, .film-center, .reel-arc, .bridal-stage, .bridal-info");
  targets.forEach(t => t.classList.add("reveal"));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  targets.forEach(t => io.observe(t));
}

/* ═══════════════════════════════════════════════
   BOOT
   ═══════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  renderChips();
  filterRail();
  renderLooks();
  paintTL();
  bindTL();
  requestAnimationFrame(() => tlGo(6, true));
  renderSilks();
  bindFilm();
  renderReels();
  renderBridal();
  bindNav();
  bindReveal();

  $("#rackClose").addEventListener("click", closeRackOverlay);
  $("#rackPrev").addEventListener("click", () => ovStep(-1));
  $("#rackNext").addEventListener("click", () => ovStep(1));
  document.addEventListener("keydown", e => {
    if (!$("#rackOverlay").hidden) {
      if (e.key === "Escape") closeRackOverlay();
      if (e.key === "ArrowLeft") ovStep(-1);
      if (e.key === "ArrowRight") ovStep(1);
    }
    if (!$("#reelFull").hidden && e.key === "Escape") { $("#reelFull").hidden = true; document.body.style.overflow = ""; }
  });
  $$(".ov-toggle button").forEach(b => b.addEventListener("click", () => { ovSide = b.dataset.side; paintOverlay(); }));
  $$("#ovSizes button").forEach(b => b.addEventListener("click", () => {
    $$("#ovSizes button").forEach(x => x.classList.remove("sel"));
    b.classList.add("sel");
    ovSize = b.textContent;
    const sel = $("#ovSelect");
    sel.disabled = false;
    sel.classList.add("ready");
    sel.textContent = `SIZE ${ovSize} · ADD TO BAG`;
  }));
  $("#ovSelect").addEventListener("click", () => {
    if ($("#ovSelect").disabled) return;
    bumpBag();
    toast(`<b>${ovItem.name}</b> · size ${ovSize} added to bag`);
  });
  $("#ovWish").addEventListener("click", () => { bumpWish(); toast("Saved to your <b>wishlist</b>"); });
  $("#reelFullClose").addEventListener("click", () => { $("#reelFull").hidden = true; document.body.style.overflow = ""; });
});
