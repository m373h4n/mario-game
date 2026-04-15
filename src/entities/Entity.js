// ============================================================
// TEMEL VARLIK SINIFI (Entity)
// Tum oyun nesnelerinin (Mario, dusmanlar, toplanabilirler)
// miras aldigi ana sinif. Konum, hiz, boyut ve temel fizigi icerir.
// ============================================================

import { KONFIG } from '../config.js';

export class Varlik {
  constructor(x, y, genislik, yukseklik) {
    // Konum
    this.x = x;
    this.y = y;

    // Boyut (piksel)
    this.genislik = genislik;
    this.yukseklik = yukseklik;

    // Hiz vektoru (piksel/saniye)
    this.hizX = 0;
    this.hizY = 0;

    // Durum bayraklari
    this.aktif = true;       // false = guncelleme/cizim yapilmaz, silinir
    this.yerde = false;      // Zeminde mi?
    this.sagaBakiyor = true; // Bakis yonu

    // Animasyon
    this.animZaman = 0;      // Toplam gecen sure (saniye)
    this.animKare = 0;       // Mevcut animasyon karesi
  }

  // Yerçekimini uygula - her alt sinif update'de cagirabilir
  yercekimiUygula(dt) {
    if (!this.yerde) {
      this.hizY += KONFIG.YERCEKIMI * dt;
      // Maksimum dusus hizini asma
      if (this.hizY > KONFIG.MAKSIMUM_DUSME) {
        this.hizY = KONFIG.MAKSIMUM_DUSME;
      }
    }
  }

  // Pozisyonu hiza gore guncelle
  pozisyonGuncelle(dt) {
    this.x += this.hizX * dt;
    this.y += this.hizY * dt;
  }

  // Animasyon zamanini guncelle
  animasyonGuncelle(dt, hiz = 8) {
    this.animZaman += dt;
    // Her (1/hiz) saniyede bir kareyi degistir
    this.animKare = Math.floor(this.animZaman * hiz) % 4;
  }

  // AABB sinir kutusunu dondur (carpisma hesaplama icin)
  sinirKutusu() {
    return {
      x: this.x,
      y: this.y,
      genislik: this.genislik,
      yukseklik: this.yukseklik,
    };
  }

  // Merkez noktasi
  merkezX() { return this.x + this.genislik / 2; }
  merkezY() { return this.y + this.yukseklik / 2; }

  // Alt siniflar bu metodlari override eder
  guncelle(dt, input, level) {}
  ciz(ctx, kameraX, kameraY) {}
}
