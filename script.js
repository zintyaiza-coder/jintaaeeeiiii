const canvas = document.getElementById('canvas-partikel');
const ctx = canvas.getContext('2d');
const tamanBunga = document.getElementById('taman-bunga');
const rumputContainer = document.getElementById('rumput-container');
const lirikContainer = document.getElementById('lirik-container');
const teksLirik = document.getElementById('teks-lirik');
const layarTantangan = document.getElementById('layar-tantangan');
const pesanSalah = document.getElementById('pesan-salah');
const petunjuk = document.getElementById('petunjuk');
const btnUlang = document.getElementById('btn-ulang');
const lagu = document.getElementById('lagu');
const tombolPilihan = document.querySelectorAll('.btn-pilihan');

let gameAktif = false;
let partikelArray = [];
let indeksLirikAktif = -1;

const daftarJenisBunga = ['jenis-cyan', 'jenis-pink', 'jenis-ungu', 'jenis-emas'];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// --- PARTIKEL KUNANG-KUNANG ---
class Partikel {
    constructor(x, y, spesial = false) {
        this.x = x || Math.random() * canvas.width;
        this.y = y || canvas.height + Math.random() * 100;
        this.size = spesial ? Math.random() * 4 + 2 : Math.random() * 2.5 + 1;
        this.speedY = spesial ? (Math.random() - 0.5) * 4 : -(Math.random() * 1.1 + 0.3);
        this.speedX = (Math.random() - 0.5) * (spesial ? 4 : 0.7);
        this.opacity = Math.random() * 0.8 + 0.2;
        this.fade = spesial ? 0.02 : 0.002;
        this.spesial = spesial;
        const warnaList = ['#5eead4', '#fef08a', '#f472b6', '#c084fc'];
        this.color = warnaList[Math.floor(Math.random() * warnaList.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.spesial) {
            this.opacity -= this.fade;
        } else if (this.y < -10) {
            this.y = canvas.height + 10;
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        if (this.opacity <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 14;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
    }
}

function initPartikel() {
    partikelArray = [];
    for (let i = 0; i < 75; i++) {
        partikelArray.push(new Partikel(Math.random() * canvas.width, Math.random() * canvas.height));
    }
}

function animasiCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = partikelArray.length - 1; i >= 0; i--) {
        partikelArray[i].update();
        partikelArray[i].draw();
        if (partikelArray[i].spesial && partikelArray[i].opacity <= 0) {
            partikelArray.splice(i, 1);
        }
    }
    requestAnimationFrame(animasiCanvas);
}
initPartikel();
animasiCanvas();

function buatRumput() {
    rumputContainer.innerHTML = '';
    const jumlah = Math.floor(window.innerWidth / 18);
    for (let i = 0; i < jumlah; i++) {
        const r = document.createElement('div');
        r.classList.add('helai-rumput');
        r.style.left = (i * 18 + Math.random() * 10) + 'px';
        r.style.height = (35 + Math.random() * 55) + 'px';
        r.style.animationDelay = (Math.random() * 2) + 's';
        rumputContainer.appendChild(r);
    }
}

tombolPilihan.forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.getAttribute('data-jawaban') === 'benar') {
            mulaiPertunjukan();
        } else {
            pesanSalah.classList.remove('tersembunyi');
        }
    });
});

function ubahLirik(teksBaru) {
    teksLirik.classList.add('lirik-transisi');
    setTimeout(() => {
        teksLirik.innerText = teksBaru;
        teksLirik.classList.remove('lirik-transisi');
    }, 350);
}

// --- JADWAL LIRIK YANG SUDAH DISINKRONKAN DENGAN AUDIO KAMU ---
const jadwalLirik = [
    { detik: 0.0, teks: "Mm, too young, too dumb to realize", aksiBunga: true },
    { detik: 3.5, teks: "That I should have bought you flowers 🌸[cite: 1]", aksiBunga: true },
    { detik: 8.5, teks: "And held your hand 🤍[cite: 1]", aksiBunga: true },
    { detik: 13.0, teks: "Should have gave you all my hours[cite: 1]", aksiBunga: false },
    { detik: 17.5, teks: "When I had the chance[cite: 1]", aksiBunga: true },
    { detik: 22.0, teks: "Take you to every party 'cause all you wanted to do was dance[cite: 1]", aksiBunga: true },
    { detik: 29.5, teks: "♪ Now my baby's dancing, but she's dancing with another man ♪[cite: 1]", aksiBunga: true }
];

// Sinkronisasi Real-Time dengan Audio
lagu.addEventListener('timeupdate', () => {
    if (!gameAktif) return;
    const waktuSekarang = lagu.currentTime;

    for (let i = jadwalLirik.length - 1; i >= 0; i--) {
        if (waktuSekarang >= jadwalLirik[i].detik) {
            if (indeksLirikAktif !== i) {
                indeksLirikAktif = i;
                ubahLirik(jadwalLirik[i].teks);
                
                if (jadwalLirik[i].aksiBunga) {
                    const posX = (window.innerWidth * 0.15) + Math.random() * (window.innerWidth * 0.7);
                    const tinggi = 160 + Math.random() * 120;
                    const skala = 0.8 + Math.random() * 0.4;
                    tanamBungaMewah(posX, tinggi, skala);
                }
            }
            break;
        }
    }
});

function mulaiPertunjukan() {
    gameAktif = true;
    indeksLirikAktif = -1;
    layarTantangan.classList.add('tersembunyi');
    lirikContainer.classList.remove('tersembunyi');
    petunjuk.classList.remove('tersembunyi');
    btnUlang.classList.remove('tersembunyi');
    buatRumput();

    // Memutar lagu dari detik ke-0 (karena audionya pas dimulai dari reff)[cite: 1]
    lagu.currentTime = 0; 
    lagu.volume = 0.9;
    lagu.play().catch(() => console.log("Menunggu interaksi audio"));

    // BEGITU TOMBOL FLOWERS DITEKAN: Langsung mekar 10 bunga sekaligus biar rimbun!
    for (let i = 0; i < 10; i++) {
        const posX = (window.innerWidth * 0.1) + Math.random() * (window.innerWidth * 0.8);
        const tinggi = 160 + Math.random() * 120;
        const skala = 0.8 + Math.random() * 0.4;
        tanamBungaMewah(posX, tinggi, skala);
    }

    const warnaKupu = ['#5eead4', '#f472b6', '#c084fc', '#fef08a'];
    for (let k = 0; k < 6; k++) {
        const kx = (window.innerWidth * 0.2) + Math.random() * (window.innerWidth * 0.6);
        const ky = (window.innerHeight * 0.4) + Math.random() * (window.innerHeight * 0.35);
        const warna = warnaKupu[k % warnaKupu.length];
        munculkanKupuCahaya(kx, ky, warna);
    }
}

function tanamBungaMewah(x, tinggi, skala) {
    const jenis = daftarJenisBunga[Math.floor(Math.random() * daftarJenisBunga.length)];
    const wrapper = document.createElement('div');
    wrapper.classList.add('bunga-wrapper', jenis);
    wrapper.style.left = x + 'px';
    wrapper.style.setProperty('--tinggi-batang', tinggi + 'px');
    wrapper.style.setProperty('--skala', skala);
    wrapper.style.setProperty('--durasi-angin', (4 + Math.random() * 2) + 's');
    wrapper.style.setProperty('--sudut-awal', (-3 - Math.random() * 3) + 'deg');
    wrapper.style.setProperty('--sudut-akhir', (3 + Math.random() * 3) + 'deg');

    wrapper.innerHTML = `
        <div class="batang">
            <div class="daun kiri" style="--rot-daun: -25deg;"></div>
            <div class="daun kanan" style="--rot-daun: 25deg;"></div>
            <div class="mahkota-bunga">
                <div class="kelopak"></div>
                <div class="kelopak"></div>
                <div class="kelopak"></div>
                <div class="kelopak"></div>
                <div class="kelopak"></div>
                <div class="inti-cahaya"></div>
            </div>
        </div>
    `;

    tamanBunga.appendChild(wrapper);
}

function munculkanKupuCahaya(x, y, warna) {
    const kupu = document.createElement('div');
    kupu.classList.add('kupu-magis');
    kupu.style.left = x + 'px';
    kupu.style.top = y + 'px';
    kupu.style.setProperty('--warna-kupu', warna);
    kupu.style.setProperty('--durasi-terbang', (8 + Math.random() * 6) + 's');

    kupu.innerHTML = `
        <div class="sayap-kupu">
            <div class="sayap-kiri"></div>
            <div class="sayap-kanan"></div>
        </div>
    `;

    tamanBunga.appendChild(kupu);
}

// Klik di mana saja di layar untuk nanam bunga tambahan & partikel
document.addEventListener('click', (e) => {
    if (!gameAktif) return;
    if (e.target.closest('#btn-ulang') || e.target.closest('.overlay')) return;

    for (let i = 0; i < 15; i++) {
        partikelArray.push(new Partikel(e.clientX, e.clientY, true));
    }

    const tinggiBunga = Math.max(140, window.innerHeight - e.clientY);
    const skalaAcak = 0.75 + Math.random() * 0.4;
    tanamBungaMewah(e.clientX, tinggiBunga, skalaAcak);
});

// Tombol Main Lagi / Reset
btnUlang.addEventListener('click', () => {
    gameAktif = false;
    indeksLirikAktif = -1;
    tamanBunga.innerHTML = '';
    rumputContainer.innerHTML = '';
    lagu.pause();
    lagu.currentTime = 0;
    lirikContainer.classList.add('tersembunyi');
    petunjuk.classList.add('tersembunyi');
    btnUlang.classList.add('tersembunyi');
    pesanSalah.classList.add('tersembunyi');
    teksLirik.innerText = '';
    layarTantangan.classList.remove('tersembunyi');
});
