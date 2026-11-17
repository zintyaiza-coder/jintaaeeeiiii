const taman = document.getElementById('taman');
const teksSkor = document.getElementById('skor');
const teksKupu = document.getElementById('jumlah-kupu');
const musik = document.getElementById('musik-game');

let skorBunga = 0;
let jumlahKupu = 0;
let laguSudahNyala = false;

const jenisBunga = ['🌸', '🌻', '🌷', '🌺', '🌼'];

// Fungsi memunculkan bibit cahaya yang harus diklik
function munculkanBibit() {
    const bibit = document.createElement('div');
    bibit.classList.add('bibit');

    // Posisi acak di layar (biar tidak ketutup papan skor atas)
    const x = Math.random() * (window.innerWidth - 100) + 50;
    const y = Math.random() * (window.innerHeight - 180) + 120;

    bibit.style.left = x + 'px';
    bibit.style.top = y + 'px';

    // Jika bibit diklik oleh pemain
    bibit.addEventListener('click', function() {
        // 1. Nyalakan lagu jika belum menyala
        if (!laguSudahNyala) {
            musik.play().catch(e => console.log("Menunggu interaksi audio..."));
            laguSudahNyala = true;
        }

        // 2. Hapus bibit dan munculkan bunga mekar di tempat yang sama
        bibit.remove();
        mekarkanBunga(x, y);

        // 3. Update skor
        skorBunga++;
        teksSkor.innerText = skorBunga;

        // 4. Setiap 2 bunga mekar, munculkan 1 kupu-kupu!
        if (skorBunga % 2 === 0) {
            munculkanKupuKupu(x, y);
        }
    });

    taman.appendChild(bibit);

    // Jika tidak diklik dalam 4 detik, bibit menghilang
    setTimeout(() => {
        if (bibit.parentElement) {
            bibit.remove();
        }
    }, 4000);
}

// Fungsi membuat bunga mekar
function mekarkanBunga(x, y) {
    const bunga = document.createElement('div');
    bunga.classList.add('bunga');
    bunga.innerText = jenisBunga[Math.floor(Math.random() * jenisBunga.length)];
    bunga.style.left = x + 'px';
    bunga.style.top = y + 'px';
    taman.appendChild(bunga);
}

// Fungsi membuat kupu-kupu terbang
function munculkanKupuKupu(x, y) {
    const kupu = document.createElement('div');
    kupu.classList.add('kupu-kupu');
    kupu.innerText = '🦋';
    kupu.style.left = x + 'px';
    kupu.style.top = (y - 30) + 'px';
    taman.appendChild(kupu);

    jumlahKupu++;
    teksKupu.innerText = jumlahKupu;
}

// Jalankan permainan: munculkan bibit setiap 1.5 detik
setInterval(munculkanBibit, 1500);
