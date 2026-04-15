// ============================================================
// MANTAR (GÜÇ MANTARI)
// Soru bloğundan cikan kirmizi mantar.
// Ciktiktan sonra bir yönde kayar, duvarlara carparsa don degistirir.
// Mario dokunduğunda Mario'yu buyutur.
// ============================================================

import { Varlik } from './Entity.js';
import { tileCarpismaCozu } from '../physics.js';
import { mantarCiz } from '../sprites/spriteRenderer.js';

const MANTAR_HIZ = 80; // Piksel/saniye
const CIKMA_SURESI = 0.4; // Bloktan cikma animasyon suresi

export class Mantar extends Varlik {
  constructor(x, y) {
    super(x, y, 28, 28);
    this.hizX = MANTAR_HIZ; // Saga kaymaya basla
    this.cikmaZaman = 0;    // Bloktan cikma animasyonu
    this.cikiyor = true;    // Bloktan cikma modunda mi?
    this.cikmaBaslangicY = y; // Cikma animasyonu baslangic Y
    this.toplandi = false;
  }

  guncelle(dt, input, level) {
    if (!this.aktif || this.toplandi) return;

    if (this.cikiyor) {
      // Bloktan yukari cikma animasyonu
      this.cikmaZaman += dt;
      const ilerleme = Math.min(this.cikmaZaman / CIKMA_SURESI, 1);
      this.y = this.cikmaBaslangicY - ilerleme * 32; // 32px yukarı cik
      if (ilerleme >= 1) {
        this.cikiyor = false;
      }
      return;
    }

    // Normal hareket
    this.yercekimiUygula(dt);
    this.x += this.hizX * dt;
    this.y += this.hizY * dt;

    // Tile carpisma
    const carpisma = tileCarpismaCozu(this, level.tileMap);

    if (carpisma.yerde) this.yerde = true;

    // Duvara carptiysa yon degistir
    if (carpisma.duvara) {
      this.hizX = -this.hizX;
    }

    // Dunya sinirlari
    if (this.x < 0) {
      this.x = 0;
      this.hizX = MANTAR_HIZ;
    }

    // Ucurum: kaybolur
    if (this.y > level.yukseklik + 50) {
      this.aktif = false;
    }
  }

  topla(mario, ses) {
    if (this.toplandi || this.cikiyor) return;
    this.toplandi = true;
    this.aktif = false;
    mario.mantarTopla(ses);
  }

  ciz(ctx, kameraX, kameraY) {
    if (!this.aktif && !this.toplandi) return;
    const ekranX = this.x - kameraX;
    const ekranY = this.y - kameraY;
    mantarCiz(ctx, ekranX, ekranY);
  }
}
