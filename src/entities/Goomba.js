// ============================================================
// GOOMBA DUSMANI
// En temel dusman tipi. Sabit hizda yurur, duvara carpinca
// yön degistirir. Ustune basilinca ezilir ve kaybolur.
// ============================================================

import { Varlik } from './Entity.js';
import { tileCarpismaCozu } from '../physics.js';
import { goombaCiz } from '../sprites/spriteRenderer.js';

const GOOMBA_HIZ = 70; // Piksel/saniye
const EZILME_SURE = 0.4; // Ezildikten sonra ne kadar ekranda kalsin

export class Goomba extends Varlik {
  constructor(x, y) {
    super(x, y, 28, 28);
    this.hizX = -GOOMBA_HIZ; // Baslarken sola yurur
    this.ezildi = false;
    this.ezilmeZaman = 0;
    this.puan = 100;
  }

  guncelle(dt, input, level) {
    if (!this.aktif) return;

    // Ezilmis animasyonu goster, sonra kaybol
    if (this.ezildi) {
      this.ezilmeZaman += dt;
      if (this.ezilmeZaman >= EZILME_SURE) {
        this.aktif = false;
      }
      return;
    }

    // Yerçekimi
    this.yercekimiUygula(dt);

    // Hareket
    this.x += this.hizX * dt;
    this.y += this.hizY * dt;

    // Tile carpisma
    const carpisma = tileCarpismaCozu(this, level.tileMap);

    if (carpisma.yerde) {
      this.yerde = true;
    }

    // Duvara carptiysa yon degistir
    if (carpisma.duvara) {
      this.hizX = -this.hizX;
      this.sagaBakiyor = this.hizX > 0;
    }

    // Platformun kenarindan dustuyse yon degistir
    // (zemin tarama: ayagin altindaki tile bos mu?)
    if (this.yerde) {
      const onundekiX = this.hizX > 0
        ? this.x + this.genislik + 2
        : this.x - 2;
      const ayakY = this.y + this.yukseklik + 1;
      const onTile = level.tileMap.pikseldenTile(onundekiX, ayakY);
      if (!onTile || !onTile.kati) {
        this.hizX = -this.hizX;
        this.sagaBakiyor = this.hizX > 0;
      }
    }

    // Dunya sinirlari (sol)
    if (this.x < 0) {
      this.x = 0;
      this.hizX = GOOMBA_HIZ;
    }

    // Animasyon
    this.animasyonGuncelle(dt, 6);
  }

  // Mario ustune bastinda cagir
  ez(ses) {
    if (this.ezildi) return;
    this.ezildi = true;
    this.hizX = 0;
    this.hizY = 0;
    if (ses) ses.dusmanEz();
  }

  // Ucurumdan dustuyse sil
  ucurumKontrol(levelYuksekligi) {
    if (this.y > levelYuksekligi + 50) {
      this.aktif = false;
    }
  }

  ciz(ctx, kameraX, kameraY) {
    if (!this.aktif) return;
    const ekranX = this.x - kameraX;
    const ekranY = this.y - kameraY;
    goombaCiz(ctx, ekranX, ekranY, this.animKare, this.ezildi);
  }
}
