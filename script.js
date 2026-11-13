const ulosData = [
  {id:1,name:"Ulos Ragidup",category:"Adat",meaning:"Lambang kehidupan yang penuh harapan dan berkat.",use:"Dikenakan dalam upacara adat penting.",description:"Ragidup dikenal sebagai salah satu ulos yang memiliki kedudukan penting dalam adat Batak Toba. Motifnya memiliki susunan yang kaya dan sering dikaitkan dengan doa untuk kehidupan yang baik.",tone:"#9b3d2d"},
  {id:2,name:"Ulos Ragi Hotang",category:"Upacara",meaning:"Melambangkan ikatan dan hubungan yang kuat.",use:"Sering diberikan dalam acara pernikahan.",description:"Ragi Hotang memiliki motif yang terinspirasi dari rotan. Dalam tradisi tertentu, ulos ini diberikan sebagai simbol penguatan ikatan dalam kehidupan berumah tangga.",tone:"#7e3430"},
  {id:3,name:"Ulos Sadum",category:"Kehidupan",meaning:"Keceriaan, kehangatan, dan sukacita.",use:"Acara sukacita dan kegiatan adat.",description:"Ulos Sadum dikenal dengan warna yang cerah dan beragam. Kain ini sering diasosiasikan dengan suasana gembira dan digunakan dalam berbagai kegiatan adat.",tone:"#a64b36"},
  {id:4,name:"Ulos Bintang Maratur",category:"Adat",meaning:"Keteraturan dan harapan baik bagi keluarga.",use:"Pemberian dalam konteks adat dan keluarga.",description:"Nama Bintang Maratur merujuk pada susunan motif yang teratur. Maknanya kerap dihubungkan dengan harapan agar kehidupan keluarga berjalan baik dan terarah.",tone:"#6f3834"},
  {id:5,name:"Ulos Sibolang",category:"Upacara",meaning:"Penghormatan dan ungkapan belasungkawa.",use:"Dalam konteks adat tertentu, termasuk suasana duka.",description:"Sibolang memiliki karakter warna yang cenderung lebih gelap. Penggunaannya berkaitan dengan konteks adat tertentu dan perlu dipahami sesuai aturan setempat.",tone:"#34434a"},
  {id:6,name:"Ulos Mangiring",category:"Kehidupan",meaning:"Harapan akan keturunan dan kesinambungan.",use:"Dapat diberikan kepada keluarga yang menyambut kelahiran.",description:"Mangiring sering dikaitkan dengan harapan akan hadirnya generasi penerus. Pemberiannya menjadi bentuk doa dan perhatian kepada keluarga.",tone:"#8e4932"},
  {id:7,name:"Ulos Pinuncaan",category:"Adat",meaning:"Kehormatan dan nilai adat.",use:"Digunakan dalam kegiatan adat tertentu.",description:"Pinuncaan merupakan salah satu jenis ulos yang dikenal dalam tradisi Batak Toba. Pemakaian dan kedudukannya mengikuti konteks serta tata cara adat.",tone:"#754038"},
  {id:8,name:"Ulos Tumtuman",category:"Kehidupan",meaning:"Doa dan perhatian dalam hubungan keluarga.",use:"Pemberian dalam hubungan kekeluargaan.",description:"Tumtuman termasuk ragam ulos yang dapat dijumpai dalam tradisi Batak. Detail makna dan pemakaiannya dapat berbeda menurut konteks adat dan daerah.",tone:"#a65b35"}
];

const grid = document.querySelector("#catalog-grid");
const searchInput = document.querySelector("#search-input");
const categoryFilter = document.querySelector("#category-filter");
const emptyState = document.querySelector("#empty-state");
const dialog = document.querySelector("#detail-dialog");
const savedKey = "ulosKitaSaved";
let saved = loadSaved();

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(savedKey)) || []; }
  catch { return []; }
}
function persistSaved() {
  localStorage.setItem(savedKey, JSON.stringify(saved));
  document.querySelector("#saved-count").textContent = saved.length;
}
function renderCards() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const filtered = ulosData.filter(item => {
    const matchesQuery = `${item.name} ${item.meaning} ${item.description}`.toLowerCase().includes(query);
    return matchesQuery && (category === "Semua" || item.category === category);
  });
  grid.innerHTML = filtered.map(item => `
    <article class="ulos-card">
      <div class="card-art" style="--tone:${item.tone}" aria-hidden="true"></div>
      <div class="card-body">
        <div class="card-top"><span class="category-tag">${item.category}</span>
          <button class="save-button ${saved.includes(item.id) ? "active" : ""}" data-save="${item.id}" aria-label="${saved.includes(item.id) ? "Hapus dari" : "Simpan ke"} favorit" aria-pressed="${saved.includes(item.id)}">${saved.includes(item.id) ? "♥" : "♡"}</button>
        </div>
        <h3>${item.name}</h3><p>${item.meaning}</p>
      </div>
      <button class="detail-button" data-detail="${item.id}">Lihat detail →</button>
    </article>`).join("");
  document.querySelector("#result-count").textContent = `${filtered.length} dari ${ulosData.length} ulos`;
  emptyState.hidden = filtered.length !== 0;
}
function showDetail(id) {
  const item = ulosData.find(entry => entry.id === Number(id));
  if (!item) return;
  document.querySelector("#detail-pattern").style.backgroundColor = item.tone;
  document.querySelector("#detail-category").textContent = item.category;
  document.querySelector("#detail-name").textContent = item.name;
  document.querySelector("#detail-description").textContent = item.description;
  document.querySelector("#detail-meaning").textContent = item.meaning;
  document.querySelector("#detail-use").textContent = item.use;
  dialog.showModal();
}
grid.addEventListener("click", event => {
  const saveButton = event.target.closest("[data-save]");
  const detailButton = event.target.closest("[data-detail]");
  if (saveButton) {
    const id = Number(saveButton.dataset.save);
    saved = saved.includes(id) ? saved.filter(value => value !== id) : [...saved, id];
    persistSaved(); renderCards();
  }
  if (detailButton) showDetail(detailButton.dataset.detail);
});
searchInput.addEventListener("input", renderCards);
categoryFilter.addEventListener("change", renderCards);
document.querySelector("#dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
document.querySelector("#year").textContent = new Date().getFullYear();
persistSaved();
renderCards();