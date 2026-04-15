// ============================================================
// SES YÖNETİCİSİ - WEB AUDIO API
// Harici ses dosyasi kullanmadan, Web Audio API oscilator'lari
// ile tum ses efektlerini prosedural olarak uretir.
// Kullanici etkilesiminden sonra AudioContext baslatilir
// (tarayici otomatik ses calma politikasi).
// ============================================================

export class SesYoneticisi {
  constructor() {
    this.context = null;   // AudioContext
    this.aktif = true;     // Ses acik mi?
    this.basladi = false;  // Context olusturuldu mu?
  }

  // Ilk kullanici etkilesiminde context'i baslat
  _baslat() {
    if (this.basladi) return;
    try {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
      this.basladi = true;
    } catch (e) {
      console.warn('Web Audio API desteklenmiyor:', e);
      this.aktif = false;
    }
  }

  // Ses actma/kapama toggle
  sesToggle() {
    this.aktif = !this.aktif;
  }

  // Bir ses efekti cal: frekans, sekil, sure, ses siddeti, kaydirma
  _cal(freqBaslangic, freqBitis, sure, sekil = 'square', siddet = 0.3) {
    if (!this.aktif) return;
    this._baslat();
    if (!this.context) return;

    try {
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();

      osc.connect(gain);
      gain.connect(this.context.destination);

      osc.type = sekil;
      const simdi = this.context.currentTime;

      // Frekans kaydirma (pitch slide)
      osc.frequency.setValueAtTime(freqBaslangic, simdi);
      osc.frequency.exponentialRampToValueAtTime(freqBitis, simdi + sure);

      // Ses zarf: hizli acilis, yumusak kapanis
      gain.gain.setValueAtTime(siddet, simdi);
      gain.gain.exponentialRampToValueAtTime(0.001, simdi + sure);

      osc.start(simdi);
      osc.stop(simdi + sure);
    } catch (e) {
      // Ses calma hatalarini sessizce yuttur
    }
  }

  // Kisa melodic nota cal
  _nota(frekans, sure, sekil = 'square', siddet = 0.25) {
    this._cal(frekans, frekans, sure, sekil, siddet);
  }

  // Iki notalı ardi ardina cal
  _diziCal(notalar) {
    if (!this.aktif) return;
    this._baslat();
    if (!this.context) return;

    try {
      let gecikme = 0;
      for (const nota of notalar) {
        const [frekans, sure, sekil] = nota;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        osc.connect(gain);
        gain.connect(this.context.destination);
        osc.type = sekil || 'square';
        const simdi = this.context.currentTime + gecikme;
        osc.frequency.setValueAtTime(frekans, simdi);
        gain.gain.setValueAtTime(0.2, simdi);
        gain.gain.exponentialRampToValueAtTime(0.001, simdi + sure * 0.9);
        osc.start(simdi);
        osc.stop(simdi + sure);
        gecikme += sure;
      }
    } catch (e) {}
  }

  // =====================
  // SES EFEKTLERİ
  // =====================

  // Ziplama sesi: yukari giden tone
  zipla() {
    this._cal(320, 640, 0.12, 'square', 0.25);
  }

  // Coin toplama: iki kisa nota
  coin() {
    this._diziCal([
      [1046, 0.06, 'square'],   // Do yuksek
      [1318, 0.12, 'square'],   // Mi yuksek
    ]);
  }

  // Mantar toplama: yukari arpej
  mantar() {
    this._diziCal([
      [261, 0.06, 'square'],
      [329, 0.06, 'square'],
      [392, 0.06, 'square'],
      [523, 0.15, 'square'],
    ]);
  }

  // Dusman ezme: kisa kume sesi
  dusmanEz() {
    this._cal(400, 200, 0.1, 'square', 0.3);
  }

  // Hasar alma: titreyen ses
  hasar() {
    this._diziCal([
      [440, 0.05, 'sawtooth'],
      [330, 0.05, 'sawtooth'],
      [220, 0.1,  'sawtooth'],
    ]);
  }

  // Olum: asagi giden melodi
  olum() {
    this._diziCal([
      [523, 0.08, 'square'],
      [494, 0.08, 'square'],
      [440, 0.08, 'square'],
      [392, 0.08, 'square'],
      [349, 0.08, 'square'],
      [293, 0.16, 'square'],
    ]);
  }

  // Blok vurma: kisa darbe
  blokVur() {
    this._cal(180, 160, 0.06, 'square', 0.2);
  }

  // Tugla kirma: gurultulu darbe
  tuglaKir() {
    this._cal(250, 100, 0.1, 'sawtooth', 0.3);
  }

  // Level tamamlama fanfari
  levelBitti() {
    this._diziCal([
      [523, 0.1, 'square'],   // Do
      [659, 0.1, 'square'],   // Mi
      [784, 0.1, 'square'],   // Sol
      [1046,0.3, 'square'],   // Do yuksek
    ]);
  }

  // Oyun bitis (game over) melodisi
  oyunBitti() {
    this._diziCal([
      [196, 0.2, 'sawtooth'],
      [185, 0.2, 'sawtooth'],
      [175, 0.4, 'sawtooth'],
    ]);
  }
}
