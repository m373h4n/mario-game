// ============================================================
// KAMERA SİSTEMİ
// Mario'yu ekranin belirli bir noktasinda tutar.
// Harita sinirlari disina cikmaz.
// Lerp ile yumusak takip saglar.
// ============================================================

import { KONFIG } from './config.js';

export class Kamera {
  constructor() {
    this.x = 0; // Sol kenar (piksel)
    this.y = 0; // Ust kenar (piksel)

    // Canvas boyutlari
    this.en = KONFIG.CANVAS_EN;
    this.boy = KONFIG.CANVAS_BOY;

    // Mario'nun ekranda durması gereken X noktasi
    // (sol 1/3'te yani ekranin %33'unde)
    this.hedefEkranX = Math.floor(this.en * 0.33);

    // Lerp faktoru (deger arttikca kamera daha hizli takip eder)
    this.lerpFaktor = 0.15;
  }

  // Kamerayi mario konumuna gore guncelle
  guncelle(mario, dunyaGenislik, dunyaYukseklik) {
    // Hedef kamera X: Mario her zaman sol 1/3'te kalsın
    const hedefKameraX = mario.x - this.hedefEkranX;

    // Lerp ile yumusak takip (x ekseni)
    this.x += (hedefKameraX - this.x) * this.lerpFaktor;

    // Kamera asla dunya sinirlari disina cikmaz
    this.x = Math.max(0, this.x);
    this.x = Math.min(dunyaGenislik - this.en, this.x);

    // Y eksenini sabit tut (standart Mario gibi - dikey scrolling yok)
    this.y = 0;
  }

  // Belirtilen nesne kamera goruntusunde mi? (frustum culling)
  gorunurMu(x, y, genislik, yukseklik) {
    return (
      x + genislik > this.x &&
      x < this.x + this.en &&
      y + yukseklik > this.y &&
      y < this.y + this.boy
    );
  }

  // Canvas koordinatini dunya koordinatina donustur
  ekrandenDunyaX(ekranX) {
    return ekranX + this.x;
  }

  // Dunya koordinatini ekran koordinatina donustur
  dunyadenEkranX(dunyaX) {
    return dunyaX - this.x;
  }
}
