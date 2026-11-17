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

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// --- SISTEM PARTIKEL CAHAYA ---
class Partikel {
    constructor(x, y, spesial = false) {
        this.x = x || Math.random() * canvas.width;
        this.y = y || canvas.height + Math.random() * 100;
        this.size = spesial ? Math.random() * 4 + 2 : Math.random() * 2.5 + 0.8;
        this.speedY = spesial ? (Math.random() - 0.5) * 4 : -(Math.random() * 1.2 + 0.3);
        this.speedX = (Math.random() - 0.5) * (spesial ? 4 : 0.8);
        this.opacity = Math.random() * 0.8 + 0.2;
        this.fade = spesial ? 0.02 : 0.002;
        this.spesial = spesial;
        const warnaList = ['#5eead4', '#fef08a', '#38bdf8', '#ffffff'];
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
        ctx.shadowBlur = 12;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
    }
}

function initPartikel() {
    partikelArray = [];
    for (let i = 0; i < 65; i++) {
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

// --- LOGIKA TEKA-TEKI ---
tombolPilihan.forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.getAttribute('data-jawaban') === 'benar') {
            mulaiPertunjukan();
        } else {
            pesanSalah.classList.remove('tersembunyi');
            pesanSalah.style.animation = 'none';
            pesanSalah.offsetHeight;
            pesanSalah.style.animation = null;
        }
    });
});

function ubahLirik(teksBaru) {
    teksLirik.classList.add('lirik-transisi');
    setTimeout(() => {
        teksLirik.innerText = teksBaru;
        teksLirik.classList.remove('lirik-transisi');
    }, 400);
}

// --- PERTUNJUKAN UTAMA ---
function mulaiPertunjukan() {
    gameAktif = true;
    layarTantangan.classList.add('tersembunyi');
    lirikContainer.classList.remove('tersembunyi');
    petunjuk.classList.remove('tersembunyi');
    btnUlang.classList.remove('tersembunyi');
    buatRumput();

    lagu.currentTime = 0;
    lagu.volume = 0.9;
    lagu.play().catch(() => console.log("Menunggu interaksi audio"));

    const jadwalLirik = [
        { teks: "I hope...", waktu: 300 },
        { teks: "he buys you...", waktu: 2000 },
        { teks: "flowers 🌸", waktu: 3800 },
        { teks: "I hope he holds...", waktu: 6200 },
        { teks: "your hand... 🤍", waktu: 8200 },
        { teks: "Give you all his hours...", waktu: 10500 },
        { teks: "When he has the chance...", waktu: 13200 },
        { teks: "♪ That I should have bought you flowers... ♪", waktu: 16000 }
    ];

    jadwalLirik.forEach(item => {
        setTimeout(() => {
            if (gameAktif) ubahLirik(item.teks);
        }, item.waktu);
    });

    const w = window.innerWidth;
    setTimeout(() => tanamBungaMewah(w * 0.50, 260, 1.15, 0), 3500);
    setTimeout(() => tanamBungaMewah(w * 0.40, 220, 0.95, 0.2), 3800);
    setTimeout(() => tanamBungaMewah(w * 0.60, 230, 1.0, 0.3), 4000);
    setTimeout(() => tanamBungaMewah(w * 0.30, 180, 0.85, 0.1), 6500);
    setTimeout(() => tanamBungaMewah(w * 0.70, 190, 0.85, 0.2), 6800);
}

function tanamBungaMewah(x, tinggi, skala, delay) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('bunga-wrapper');
    wrapper.style.left = x + 'px';
    wrapper.style.setProperty('--tinggi-batang', tinggi + 'px');
    wrapper.style.setProperty('--skala', skala);
    wrapper.style.setProperty('--delay', delay + 's');
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

// --- INTERAKSI KLIK LAYAR ---
document.addEventListener('click', (e) => {
    if (!gameAktif) return;
    if (e.target.closest('#btn-ulang') || e.target.closest('.overlay')) return;

    for (let i = 0; i < 15; i++) {
        partikelArray.push(new Partikel(e.clientX, e.clientY, true));
    }

    const tinggiBunga = Math.max(120, window.innerHeight - e.clientY);
    const skalaAcak = 0.7 + Math.random() * 0.45;
    tanamBungaMewah(e.clientX, tinggiBunga, skalaAcak, 0);
});

btnUlang.addEventListener('click', () => {
    gameAktif = false;
    tamanBunga.innerHTML = '';
    rumputContainer.innerHTML = '';
    lagu.pause();
    lirikContainer.classList.add('tersembunyi');
    petunjuk.classList.add('tersembunyi');
    btnUlang.classList.add('tersembunyi');
    pesanSalah.classList.add('tersembunyi');
    teksLirik.innerText = '';
    layarTantangan.classList.remove('tersembunyi');
});
