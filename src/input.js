// ============================================================
// GIRIS YÖNETİCİSİ
// Klavye ve dokunma ekrani girislerini yonetir.
// Hem masaustu hem mobil cihazlari destekler.
// ============================================================

export class GirisYoneticisi {
  constructor() {
    // Hangi tuslar basilmis durumda (true = basili, false = birakilmis)
    this.tuslar = {
      sol: false,
      sag: false,
      ziplama: false,
      kosma: false,
    };

    // Klavye tuslarini dinle
    window.addEventListener('keydown', (e) => this._tusBas(e));
    window.addEventListener('keyup', (e) => this._tusBirak(e));

    // Mobil kontrolleri bagli
    this._mobilBagla();
  }

  // Klavye tusuna basilinca
  _tusBas(e) {
    switch (e.code) {
      case 'ArrowLeft':
      case 'KeyA':
        this.tuslar.sol = true;
        break;
      case 'ArrowRight':
      case 'KeyD':
        this.tuslar.sag = true;
        break;
      case 'ArrowUp':
      case 'Space':
      case 'KeyZ':
      case 'KeyW':
        this.tuslar.ziplama = true;
        e.preventDefault(); // Sayfanin kaymasini engelle
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
      case 'KeyX':
        this.tuslar.kosma = true;
        break;
    }
  }

  // Klavye tusu birakilinca
  _tusBirak(e) {
    switch (e.code) {
      case 'ArrowLeft':
      case 'KeyA':
        this.tuslar.sol = false;
        break;
      case 'ArrowRight':
      case 'KeyD':
        this.tuslar.sag = false;
        break;
      case 'ArrowUp':
      case 'Space':
      case 'KeyZ':
      case 'KeyW':
        this.tuslar.ziplama = false;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
      case 'KeyX':
        this.tuslar.kosma = false;
        break;
    }
  }

  // Mobil dokunma duğmelerini bagla
  _mobilBagla() {
    const btnSol = document.getElementById('btnLeft');
    const btnSag = document.getElementById('btnRight');
    const btnZipla = document.getElementById('btnJump');
    const btnKos = document.getElementById('btnRun');

    if (!btnSol) return; // Mobil kontroller yok, cik

    // Dokunma ve fare olaylari icin yardimci fonksiyon
    const dugmeBas = (tus) => () => { this.tuslar[tus] = true; };
    const dugmeBirak = (tus) => () => { this.tuslar[tus] = false; };

    // Sol dugme
    btnSol.addEventListener('touchstart', dugmeBas('sol'), { passive: true });
    btnSol.addEventListener('touchend', dugmeBirak('sol'), { passive: true });
    btnSol.addEventListener('mousedown', dugmeBas('sol'));
    btnSol.addEventListener('mouseup', dugmeBirak('sol'));

    // Sag dugme
    btnSag.addEventListener('touchstart', dugmeBas('sag'), { passive: true });
    btnSag.addEventListener('touchend', dugmeBirak('sag'), { passive: true });
    btnSag.addEventListener('mousedown', dugmeBas('sag'));
    btnSag.addEventListener('mouseup', dugmeBirak('sag'));

    // Ziplama dugmesi
    btnZipla.addEventListener('touchstart', dugmeBas('ziplama'), { passive: true });
    btnZipla.addEventListener('touchend', dugmeBirak('ziplama'), { passive: true });
    btnZipla.addEventListener('mousedown', dugmeBas('ziplama'));
    btnZipla.addEventListener('mouseup', dugmeBirak('ziplama'));

    // Kosma dugmesi
    btnKos.addEventListener('touchstart', dugmeBas('kosma'), { passive: true });
    btnKos.addEventListener('touchend', dugmeBirak('kosma'), { passive: true });
    btnKos.addEventListener('mousedown', dugmeBas('kosma'));
    btnKos.addEventListener('mouseup', dugmeBirak('kosma'));
  }

  // Belirtilen tus basilmis mi?
  basildi(tus) {
    return this.tuslar[tus] === true;
  }
}
