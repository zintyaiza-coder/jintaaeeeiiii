const taman = document.getElementById('taman');
const skorEl = document.getElementById('skor');
const waktuEl = document.getElementById('waktu');
const kupuEl = document.getElementById('kupu');
const lirikBox = document.getElementById('lirik-box');
const lagu = document.getElementById('lagu');

const layarMulai = document.getElementById('layar-mulai');
const layarEnding = document.getElementById('layar-ending');
const btnMulai = document.getElementById('btn-mulai');
const btnUlang = document.getElementById('btn-ulang');

let skor = 0;
let jumlahKupu = 0;
let sisaWaktu = 30;
let gameAktif = false;
let intervalBenih;
let intervalTimer;

const targetBunga = 12;

// Palet warna bunga glowing estetik
const warnaBunga = [
    { luar: '#ff7eb3', dalam: '#ff758c', putik: '#fef08a' }, // Pink Sakura
    { luar: '#c084fc', dalam: '#9333ea', putik: '#fde047' }, // Ungu Lavender
    { luar: '#60a5fa', dalam: '#2563eb', putik: '#fef9c3' }, // Biru Kristal
    { luar: '#fb7185', dalam: '#e11d48', putik: '#fde047' }  // Merah Mawar
];

// Potongan lirik yang muncul saat bunga bermekaran
const daftarLirik = [
    "♪ Too young, too dumb to realize...",
    "♪ That I should have bought you flowers 🌸",
    "♪ And held your hand...",
    "♪ Should have gave you all my hours ✨",
    "♪ When I had the chance..."
];

// Bikin kunang-kunang latar saat halaman dibuka
function buatKunangKunang() {
    const container = document.getElementById('kunang-container');
    for (let i = 0; i < 25; i++) {
        const k = document.createElement('div');
        k.classList.add('kunang');
        k.style.left = Math.random() * 100 + 'vw';
        k.style.top = Math.random() * 100 + 'vh';
        k.style.animationDuration = (4 + Math.random() * 5) + 's';
        container.appendChild(k);
    }
}
buatKunangKunang();

// Mulai Permainan
btnMulai.addEventListener('click', mulaiGame);
btnUlang.addEventListener('click', mulaiGame);

function mulaiGame() {
    // Reset kondisi awal
    skor = 0;
    jumlahKupu = 0;
    sisaWaktu = 30;
    gameAktif = true;

    skorEl.innerText = skor;
    kupuEl.innerText = jumlahKupu;
    waktuEl.innerText = sisaWaktu;
    lirikBox.innerText = "";
    taman.innerHTML = "";
    document.body.classList.remove('mode-magis');

    layarMulai.classList.add('tersembunyi');
    layarEnding.classList.add('tersembunyi');

    // Putar lagu Bruno Mars
    lagu.currentTime = 0;
    lagu.play().catch(() => console.log("Audio siap diputar"));

    // Jalankan kemunculan benih & hitung mundur waktu
    intervalBenih = setInterval(munculkanBenih, 950);
    intervalTimer = setInterval(hitungMundur, 1000);
}

function hitungMundur() {
    sisaWaktu--;
    waktuEl.innerText = sisaWaktu;

    if (sisaWaktu <= 0) {
        selesaikanGame(false);
    }
}

function munculkanBenih() {
    if (!gameAktif) return;

    const benih = document.createElement('div');
    benih.classList.add('benih');

    // Posisi benih di area bawah hingga tengah layar agar tangkai bunga terlihat proporsional
    const x = Math.random() * (window.innerWidth - 120) + 60;
    const y = Math.random() * (window.innerHeight - 250) + 180;

    benih.style.left = x + 'px';
    benih.style.top = y + 'px';

    benih.addEventListener('click', () => {
        if (!gameAktif) return;
        benih.remove();
        tumbuhkanBungaSVG(x, y);

        skor++;
        skorEl.innerText = skor;

        // Tampilkan lirik lagu tiap 2 bunga mekar
        if (skor % 2 === 0) {
            const indexLirik = Math.min(Math.floor(skor / 2) - 1, daftarLirik.length - 1);
            lirikBox.innerText = daftarLirik[indexLirik];
            munculkanKupu(x, y - 60);
        }

        // Ubah suasana langit jadi lebih magis di tengah permainan
        if (skor === 6) {
            document.body.classList.add('mode-magis');
        }

        // Cek jika target tercapai sebelum waktu habis
        if (skor >= targetBunga) {
            selesaikanGame(true);
        }
    });

    taman.appendChild(benih);

    // Benih hilang jika tidak diklik dalam 2.8 detik
    setTimeout(() => {
        if (benih.parentElement) benih.remove();
    }, 2800);
}

// Menggambar Bunga Kelopak Berlapis dengan SVG
function tumbuhkanBungaSVG(x, y) {
    const palet = warnaBunga[Math.floor(Math.random() * warnaBunga.length)];
    const wadah = document.createElement('div');
    wadah.classList.add('wadah-bunga');
    wadah.style.left = x + 'px';
    wadah.style.top = y + 'px';

    // SVG Bunga dengan 8 kelopak berlapis
    wadah.innerHTML = `
        <svg class="kepala-bunga" viewBox="0 0 100 100">
            <g transform="translate(50,50)">
                <ellipse cx="0" cy="-22" rx="12" ry="22" fill="${palet.luar}" transform="rotate(0)" />
                <ellipse cx="0" cy="-22" rx="12" ry="22" fill="${palet.luar}" transform="rotate(45)" />
                <ellipse cx="0" cy="-22" rx="12" ry="22" fill="${palet.luar}" transform="rotate(90)" />
                <ellipse cx="0" cy="-22" rx="12" ry="22" fill="${palet.luar}" transform="rotate(135)" />
                <ellipse cx="0" cy="-22" rx="12" ry="22" fill="${palet.luar}" transform="rotate(180)" />
                <ellipse cx="0" cy="-22" rx="12" ry="22" fill="${palet.luar}" transform="rotate(225)" />
                <ellipse cx="0" cy="-22" rx="12" ry="22" fill="${palet.luar}" transform="rotate(270)" />
                <ellipse cx="0" cy="-22" rx="12" ry="22" fill="${palet.luar}" transform="rotate(315)" />
                
                <!-- Kelopak Lapis Dalam -->
                <ellipse cx="0" cy="-15" rx="8" ry="15" fill="${palet.dalam}" transform="rotate(22.5)" />
                <ellipse cx="0" cy="-15" rx="8" ry="15" fill="${palet.dalam}" transform="rotate(67.5)" />
                <ellipse cx="0" cy="-15" rx="8" ry="15" fill="${palet.dalam}" transform="rotate(112.5)" />
                <ellipse cx="0" cy="-15" rx="8" ry="15" fill="${palet.dalam}" transform="rotate(157.5)" />
                <ellipse cx="0" cy="-15" rx="8" ry="15" fill="${palet.dalam}" transform="rotate(202.5)" />
                <ellipse cx="0" cy="-15" rx="8" ry="15" fill="${palet.dalam}" transform="rotate(247.5)" />
                <ellipse cx="0" cy="-15" rx="8" ry="15" fill="${palet.dalam}" transform="rotate(292.5)" />
                <ellipse cx="0" cy="-15" rx="8" ry="15" fill="${palet.dalam}" transform="rotate(337.5)" />

                <!-- Putik Tengah -->
                <circle cx="0" cy="0" r="9" fill="${palet.putik}" />
            </g>
        </svg>
        <div class="tangkai"></div>
    `;

    taman.appendChild(wadah);
}

function munculkanKupu(x, y) {
    const kupu = document.createElement('div');
    kupu.classList.add('kupu');
    kupu.innerText = '🦋';
    kupu.style.left = x + 'px';
    kupu.style.top = y + 'px';
    taman.appendChild(kupu);

    jumlahKupu++;
    kupuEl.innerText = jumlahKupu;
}

function selesaikanGame(menang) {
    gameAktif = false;
    clearInterval(intervalBenih);
    clearInterval(intervalTimer);

    const judul = document.getElementById('judul-ending');
    const pesan = document.getElementById('pesan-ending');

    if (menang) {
        judul.innerText = "✨ Taman Impian Terwujud! 🌸🦋";
        pesan.innerText = '"That I should have bought you flowers, and held your hand..." Semua bunga berhasil mekar sempurna!';
        // Tambah kupu-kupu perayaan
        for (let i = 0; i < 6; i++) {
            munculkanKupu(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
        }
    } else {
        judul.innerText = "⏳ Waktu Habis!";
        pesan.innerText = "Yah, baru sebagian bunga yang mekar. Yuk coba tangkap benih cahayanya lebih cepat!";
    }

    document.getElementById('skor-akhir').innerText = skor;
    document.getElementById('kupu-akhir').innerText = jumlahKupu;

    setTimeout(() => {
        layarEnding.classList.remove('tersembunyi');
    }, 1200);
}
