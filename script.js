// ── FORMAT CURRENCY ──────────────────────────────────────────
const fmt = v => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',minimumFractionDigits:0}).format(v);

// ── TOGGLE CARD ──────────────────────────────────────────────
function toggleCard(id) {
  const card = document.getElementById(id);
  if (!card) return;
  card.classList.toggle('expanded');
  
  // Update sidebar active
  document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
  const sideLink = document.querySelector(`.sidebar-item[onclick*="'${id}'"]`);
  if (sideLink) sideLink.classList.add('active');
}

function scrollToCard(id) {
  const card = document.getElementById(id);
  if (!card) return;
  card.scrollIntoView({behavior:'smooth', block:'start'});
  if (!card.classList.contains('expanded')) card.classList.add('expanded');
  
  document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
  const sideLink = document.querySelector(`.sidebar-item[onclick*="'${id}'"]`);
  if (sideLink) sideLink.classList.add('active');
  return false;
}

// ── FILTER ───────────────────────────────────────────────────
function filterCards(type, btn) {
  const cards = document.querySelectorAll('.tax-card');
  let visible = 0;
  cards.forEach(card => {
    const t = card.dataset.type;
    const show = type === 'all' || t === type;
    card.classList.toggle('hidden', !show);
    if (show) visible++;
  });
  
  // Update button styles
  document.querySelectorAll('.filter-tab').forEach(b => b.className = 'filter-tab');
  btn.classList.add('filter-tab', `active-${type}`);
  
  document.getElementById('emptyState').style.display = visible === 0 ? 'block' : 'none';
}

// ── SEARCH ───────────────────────────────────────────────────
document.getElementById('searchInput').addEventListener('input', function() {
  const q = this.value.toLowerCase().trim();
  const cards = document.querySelectorAll('.tax-card');
  let visible = 0;
  
  cards.forEach(card => {
    const keywords = (card.dataset.keywords || '') + ' ' + (card.querySelector('.tax-card-name')?.textContent || '');
    const show = !q || keywords.toLowerCase().includes(q);
    card.classList.toggle('hidden', !show);
    if (show) visible++;
  });
  
  const empty = document.getElementById('emptyState');
  empty.style.display = visible === 0 ? 'block' : 'none';
  document.getElementById('emptyQuery').textContent = q;
  
  // Reset filter tabs
  if (!q) {
    document.querySelectorAll('.filter-tab').forEach(b => b.className = 'filter-tab');
    document.getElementById('tab-all').classList.add('filter-tab','active-all');
  }
});

// ── SCROLL & PROGRESS ────────────────────────────────────────
window.addEventListener('scroll', function() {
  const btn = document.getElementById('scrollTopBtn');
  btn.classList.toggle('visible', window.scrollY > 400);
  
  const prog = document.getElementById('tocProgress');
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  prog.style.width = (docH > 0 ? (window.scrollY/docH)*100 : 0) + '%';
});

// ── CALCULATORS ──────────────────────────────────────────────
function showOutput(id) {
  document.getElementById(id).classList.add('show');
}

// PKB: auto-fill tarif saat dropdown "Kendaraan ke-" berubah (UU HKPD Pasal 8)
// Tarif dasar maks 1%, tiap kendaraan berikutnya +0.5%
function updatePKBTarif(selectEl) {
  const selected = selectEl.options[selectEl.selectedIndex];
  const tarif = selected.getAttribute('data-tarif');
  const tarifInput = document.getElementById('pkb-tarif');
  tarifInput.value = tarif;
  // Flash border biru sebagai visual feedback
  tarifInput.style.borderColor = '#3b82f6';
  tarifInput.style.color = '#60a5fa';
  setTimeout(() => {
    tarifInput.style.borderColor = '';
    tarifInput.style.color = '';
  }, 800);
}

function calcPKB() {
  const njkb = +document.getElementById('pkb-njkb').value;
  const bobot = +document.getElementById('pkb-bobot').value;
  const tarif = +document.getElementById('pkb-tarif').value / 100;

  const dpp = njkb * bobot;
  const pkb = dpp * tarif;
  const opsen = pkb * 0.66;
  const total = pkb + opsen;

  document.getElementById('pkb-r1').textContent = fmt(dpp);
  document.getElementById('pkb-r2').textContent = fmt(pkb);
  document.getElementById('pkb-r3').textContent = fmt(opsen);
  document.getElementById('pkb-r4').textContent = fmt(total);
  showOutput('pkb-output');
}


function calcBBNKB() {
  const njkb = +document.getElementById('bbnkb-njkb').value;
  const tarif = +document.getElementById('bbnkb-tarif').value / 100;
  const opsenYa = document.getElementById('bbnkb-opsen').value === 'ya';
  
  const bbnkb = njkb * tarif;
  const opsen = opsenYa ? bbnkb * 0.66 : 0;
  const total = bbnkb + opsen;
  
  document.getElementById('bbnkb-r1').textContent = fmt(njkb);
  document.getElementById('bbnkb-r2').textContent = fmt(bbnkb);
  document.getElementById('bbnkb-r3').textContent = opsenYa ? fmt(opsen) : 'N/A (Provinsi Khusus)';
  document.getElementById('bbnkb-r4').textContent = fmt(total);
  showOutput('bbnkb-output');
}

function calcPAB() {
  const nilai = +document.getElementById('pab-nilai').value;
  const tarif = +document.getElementById('pab-tarif').value / 100;
  const unit = +document.getElementById('pab-unit').value;
  
  const pab = nilai * tarif;
  const total = pab * unit;
  
  document.getElementById('pab-r1').textContent = fmt(nilai);
  document.getElementById('pab-r2').textContent = fmt(pab);
  document.getElementById('pab-r4').textContent = fmt(total);
  showOutput('pab-output');
}

function calcPBBKB() {
  const harga = +document.getElementById('pbbkb-harga').value;
  const vol = +document.getElementById('pbbkb-volume').value;
  const tarif = +document.getElementById('pbbkb-tarif').value / 100;
  
  const dpp = harga * vol;
  const pajak = dpp * tarif;
  const provinsi = pajak * 0.30;
  const kabkot = pajak * 0.70;
  
  document.getElementById('pbbkb-r1').textContent = fmt(dpp);
  document.getElementById('pbbkb-r2').textContent = fmt(pajak);
  document.getElementById('pbbkb-r3').textContent = fmt(provinsi);
  document.getElementById('pbbkb-r4').textContent = fmt(kabkot);
  showOutput('pbbkb-output');
}

function calcPAP() {
  const vol = +document.getElementById('pap-vol').value;
  const harga = +document.getElementById('pap-harga').value;
  const bobot = +document.getElementById('pap-bobot').value;
  const tarif = +document.getElementById('pap-tarif').value / 100;
  
  const dpp = harga * bobot * vol;
  const pajak = dpp * tarif;
  
  document.getElementById('pap-r1').textContent = fmt(dpp);
  document.getElementById('pap-r2').textContent = fmt(pajak);
  document.getElementById('pap-r3').textContent = fmt(pajak * 0.5);
  document.getElementById('pap-r4').textContent = fmt(pajak * 0.5);
  showOutput('pap-output');
}

function calcRokok() {
  const cukai = +document.getElementById('rok-cukai').value;
  const prop = +document.getElementById('rok-proporsi').value / 100;
  
  const totalPajak = cukai * 0.10;
  const bagProv = totalPajak * prop;
  const kabkot = bagProv * 0.70;
  const prov = bagProv * 0.30;
  
  document.getElementById('rok-r1').textContent = fmt(totalPajak);
  document.getElementById('rok-r2').textContent = fmt(bagProv);
  document.getElementById('rok-r3').textContent = fmt(kabkot);
  document.getElementById('rok-r4').textContent = fmt(prov);
  showOutput('rok-output');
}

function calcPBB() {
  const bumi = +document.getElementById('pbb-bumi').value;
  const bang = +document.getElementById('pbb-bang').value;
  const tkp = +document.getElementById('pbb-tkp').value;
  const persen = +document.getElementById('pbb-persen').value / 100;
  const tarif = +document.getElementById('pbb-tarif').value / 100;
  
  const totalNJOP = bumi + bang;
  const setelahTKP = Math.max(0, totalNJOP - tkp);
  const dpp = setelahTKP * persen;
  const pbb = dpp * tarif;
  
  document.getElementById('pbb-r1').textContent = fmt(totalNJOP);
  document.getElementById('pbb-r2').textContent = fmt(setelahTKP);
  document.getElementById('pbb-r3').textContent = fmt(dpp);
  document.getElementById('pbb-r4').textContent = fmt(pbb);
  showOutput('pbb-output');
}

function calcBPHTB() {
  const npop = +document.getElementById('bphtb-npop').value;
  const njop = +document.getElementById('bphtb-njop').value;
  const jenis = document.getElementById('bphtb-jenis').value;
  const tarif = +document.getElementById('bphtb-tarif').value / 100;
  
  const npopUsed = Math.max(npop, njop);
  const tkp = jenis === 'waris' ? 300000000 : 80000000;
  const dpp = Math.max(0, npopUsed - tkp);
  const bphtb = dpp * tarif;
  
  document.getElementById('bphtb-r1').textContent = fmt(npopUsed);
  document.getElementById('bphtb-r2').textContent = fmt(tkp);
  document.getElementById('bphtb-r3').textContent = fmt(dpp);
  document.getElementById('bphtb-r4').textContent = fmt(bphtb);
  showOutput('bphtb-output');
}

function updatePBJTtarif() {
  const sel = document.getElementById('pbjt-jenis');
  document.getElementById('pbjt-tarif').value = sel.value;
}

function calcPBJT() {
  const tag = +document.getElementById('pbjt-tagihan').value;
  const tarif = +document.getElementById('pbjt-tarif').value / 100;
  
  const pajak = tag * tarif;
  const total = tag + pajak;
  
  document.getElementById('pbjt-r1').textContent = fmt(tag);
  document.getElementById('pbjt-r2').textContent = fmt(pajak);
  document.getElementById('pbjt-r3').textContent = fmt(total);
  showOutput('pbjt-output');
}

function calcReklame() {
  const nilai = +document.getElementById('rek-nilai').value;
  const tarif = +document.getElementById('rek-tarif').value / 100;
  
  const pajak = nilai * tarif;
  const total = nilai + pajak;
  
  document.getElementById('rek-r1').textContent = fmt(nilai);
  document.getElementById('rek-r2').textContent = fmt(pajak);
  document.getElementById('rek-r3').textContent = fmt(total);
  showOutput('rek-output');
}

function calcPAT() {
  const vol = +document.getElementById('pat-vol').value;
  const harga = +document.getElementById('pat-harga').value;
  const bobot = +document.getElementById('pat-bobot').value;
  const tarif = +document.getElementById('pat-tarif').value / 100;
  
  const dpp = harga * bobot * vol;
  const pajak = dpp * tarif;
  
  document.getElementById('pat-r1').textContent = fmt(dpp);
  document.getElementById('pat-r2').textContent = fmt(pajak);
  showOutput('pat-output');
}

function calcMBLB() {
  const vol = +document.getElementById('mblb-vol').value;
  const harga = +document.getElementById('mblb-harga').value;
  const tarif = +document.getElementById('mblb-tarif').value / 100;
  const opsenYa = document.getElementById('mblb-opsen').value === 'ya';
  
  const dpp = vol * harga;
  const pajak = dpp * tarif;
  const opsen = opsenYa ? pajak * 0.25 : 0;
  const total = pajak + opsen;
  
  document.getElementById('mblb-r1').textContent = fmt(dpp);
  document.getElementById('mblb-r2').textContent = fmt(pajak);
  document.getElementById('mblb-r3').textContent = opsenYa ? fmt(opsen) : 'Tidak dihitung';
  document.getElementById('mblb-r4').textContent = fmt(total);
  showOutput('mblb-output');
}

function calcWalet() {
  const vol = +document.getElementById('wal-vol').value;
  const harga = +document.getElementById('wal-harga').value;
  const tarif = +document.getElementById('wal-tarif').value / 100;
  
  const dpp = vol * harga;
  const pajak = dpp * tarif;
  
  document.getElementById('wal-r1').textContent = fmt(dpp);
  document.getElementById('wal-r2').textContent = fmt(pajak);
  showOutput('wal-output');
}

// ── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Auto-expand first card
  // toggleCard('pkb');
});
