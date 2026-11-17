const taman = document.getElementById('taman');
const lirikVideoBox = document.getElementById('lirik-video-box');
const teksLirikUtama = document.getElementById('teks-lirik-utama');
const lagu = document.getElementById('lagu');
const layarTantangan = document.getElementById('layar-tantangan');
const pesanSalah = document.getElementById('pesan-salah');
const btnUlang = document.getElementById('btn-ulang');
const tombolPilihan = document.querySelectorAll('.btn-pilihan');

// Palet warna bunga ala video (Cyan & Teal bercahaya)
const paletVideo = { luar: '#64ffda', dalam: '#2dd4bf', putik: '#fef08a' };

// 1. Buat bintang latar belakang
function buatBintang() {
    const container = document.getElementById('kunang-container');
    for (let i = 0; i < 50; i++) {
        const k = document.createElement('div');
        k.classList.add('kunang');
        k.style.left = Math.random() * 100 + 'vw';
        k.style.top = Math.random() * 100 + 'vh';
        k.style.animationDuration = (2 + Math.random() * 3) + 's';
        k.style.animationDelay = (Math.random() * 2) + 's';
        container.appendChild(k);
    }
}
buatBintang();

// 2. Tombol Pilihan Tantangan
tombolPilihan.forEach(btn => {
    btn.addEventListener('click', () => {
        const jawaban = btn.getAttribute('data-jawaban');
        if (jawaban === 'benar') {
            mulaiKlimaksVideo();
        } else {
            pesanSalah.classList.remove('tersembunyi');
        }
    });
});

// 3. Fungsi Utama Klimaks (Sinkronisasi Lirik & Munculnya Bunga dari Bawah)
function mulaiKlimaksVideo() {
    layarTantangan.classList.add('tersembunyi');
    btnUlang.classList.remove('tersembunyi');
    lirikVideoBox.classList.remove('tersembunyi');

    // Putar lagu
    lagu.currentTime = 0;
    lagu.volume = 0.9;
    lagu.play().catch(() => console.log("Audio siap diputar"));

    // Rangkaian lirik yang muncul berurutan sesuai alur video
    const timelineLirik = [
        { teks: "i hope", waktu: 0 },
        { teks: "he buys you", waktu: 1500 },
        { teks: "flowers", waktu: 3000 },
        { teks: "i hope he holds", waktu: 5000 },
        { teks: "your hand...", waktu: 6800 },
        { teks: "♪ That I should have bought you flowers, and held your hand...", waktu: 9000 }
    ];

    timelineLirik.forEach(item => {
        setTimeout(() => {
            teksLirikUtama.innerText = item.teks;
        }, item.waktu);
    });

    // Munculkan bunga dari bawah secara berurutan persis di detik-detik penting lagu
    setTimeout(() => tumbuhkanBungaDariBawah(window.innerWidth * 0.35, 0.2), 3000);
    setTimeout(() => tumbuhkanBungaDariBawah(window.innerWidth * 0.5, 0.1), 3200);
    setTimeout(() => tumbuhkanBungaDariBawah(window.innerWidth * 0.65, 0.3), 3400);
}

// 4. Fungsi Menggambar Bunga SVG Cyan/Teal dari Bawah
function tumbuhkanBungaDariBawah(x, jeda) {
    const wadah = document.createElement('div');
    wadah.classList.add('wadah-bunga');
    wadah.style.left = x + 'px';

    wadah.innerHTML = `
        <svg class="kepala-bunga" viewBox="0 0 100 100" style="--jeda: ${jeda}s;">
            <g transform="translate(50,50)">
                <ellipse cx="0" cy="-22" rx="12" ry="22" fill="${paletVideo.luar}" transform="rotate(0)" />
                <ellipse cx="0" cy="-22" rx="12" ry="22" fill="${paletVideo.luar}" transform="rotate(45)" />
                <ellipse cx="0" cy="-22" rx="12" ry="22" fill="${paletVideo.luar}" transform="rotate(90)" />
                <ellipse cx="0" cy="-22" rx="12" ry="22" fill="${paletVideo.luar}" transform="rotate(135)" />
                <ellipse cx="0" cy="-22" rx="12" ry="22" fill="${paletVideo.luar}" transform="rotate(180)" />
                <ellipse cx="0" cy="-22" rx="12" ry="22" fill="${paletVideo.luar}" transform="rotate(225)" />
                <ellipse cx="0" cy="-22" rx="12" ry="22" fill="${paletVideo.luar}" transform="rotate(270)" />
                <ellipse cx="0" cy="-22" rx="12" ry="22" fill="${paletVideo.luar}" transform="rotate(315)" />
                
                <ellipse cx="0" cy="-15" rx="8" ry="15" fill="${paletVideo.dalam}" transform="rotate(22.5)" />
                <ellipse cx="0" cy="-15" rx="8" ry="15" fill="${paletVideo.dalam}" transform="rotate(67.5)" />
                <ellipse cx="0" cy="-15" rx="8" ry="15" fill="${paletVideo.dalam}" transform="rotate(112.5)" />
                <ellipse cx="0" cy="-15" rx="8" ry="15" fill="${paletVideo.dalam}" transform="rotate(157.5)" />
                <ellipse cx="0" cy="-15" rx="8" ry="15" fill="${paletVideo.dalam}" transform="rotate(202.5)" />
                <ellipse cx="0" cy="-15" rx="8" ry="15" fill="${paletVideo.dalam}" transform="rotate(247.5)" />
                <ellipse cx="0" cy="-15" rx="8" ry="15" fill="${paletVideo.dalam}" transform="rotate(292.5)" />
                <ellipse cx="0" cy="-15" rx="8" ry="15" fill="${paletVideo.dalam}" transform="rotate(337.5)" />

                <circle cx="0" cy="0" r="9" fill="${paletVideo.putik}" />
            </g>
        </svg>
        <div class="tangkai" style="--jeda: ${jeda}s;"></div>
    `;

    taman.appendChild(wadah);
}

// 5. Tombol Ulangi
btnUlang.addEventListener('click', () => {
    taman.innerHTML = '';
    lagu.pause();
    lirikVideoBox.classList.add('tersembunyi');
    btnUlang.classList.add('tersembunyi');
    pesanSalah.classList.add('tersembunyi');
    layarTantangan.classList.remove('tersembunyi');
});
