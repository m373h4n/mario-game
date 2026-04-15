// ============================================================
// COİN (ALTIN PARA)
// İki tipi var:
// 1. HaritaCoin: Havada duran, Mario dokunduğunda toplanir
// 2. BlokCoin: Soru bloğundan firlar, kisa animasyon sonra kaybolur
// ============================================================

import { Varlik } from './Entity.js';
import { carpisiyor } from '../physics.js';
import { coinCiz } from '../sprites/spriteRenderer.js';

export class HaritaCoin extends Varlik {
  constructor(x, y) {
    super(x, y, 20, 24);
    this.toplandi = false;
    this.toplamAnimZaman = 0;
    this.toplamAnimSure = 0.4;
  }

  guncelle(dt, input, level) {
    if (!this.aktif) return;

    this.animasyonGuncelle(dt, 8); // Coin donme animasyonu

    if (this.toplandi) {
      // Toplama animasyonu: yukari cik ve kaybol
      this.toplamAnimZaman += dt;
      this.y -= 80 * dt; // Yukari cik
      if (this.toplamAnimZaman >= this.toplamAnimSure) {
        this.aktif = false;
      }
    }
  }

  topla(mario, ses) {
    if (this.toplandi) return;
    this.toplandi = true;
    mario.coinTopla(ses);
  }

  ciz(ctx, kameraX, kameraY) {
    if (!this.aktif) return;
    const ekranX = this.x - kameraX;
    const ekranY = this.y - kameraY;

    // Toplama animasyonunda solar
    if (this.toplandi) {
      ctx.globalAlpha = 1 - (this.toplamAnimZaman / this.toplamAnimSure);
    }

    coinCiz(ctx, ekranX, ekranY, this.animKare);
    ctx.globalAlpha = 1;
  }
}

// Bloktan firlayen coin efekti
export class BlokCoin extends Varlik {
  constructor(x, y) {
    super(x, y, 20, 24);
    this.hizY = -300; // Yukari firla
    this.yer_cekimi = 800;
    this.yasamZaman = 0;
    this.yasamSure = 0.8;
  }

  guncelle(dt, input, level) {
    if (!this.aktif) return;

    this.yasamZaman += dt;
    this.animasyonGuncelle(dt, 10);

    // Basit fizik (sadece efekt, carpisma yok)
    this.hizY += this.yer_cekimi * dt;
    this.y += this.hizY * dt;

    if (this.yasamZaman >= this.yasamSure) {
      this.aktif = false;
    }
  }

  ciz(ctx, kameraX, kameraY) {
    if (!this.aktif) return;
    const ekranX = this.x - kameraX;
    const ekranY = this.y - kameraY;
    const alpha = Math.max(0, 1 - this.yasamZaman / this.yasamSure);
    ctx.globalAlpha = alpha;
    coinCiz(ctx, ekranX, ekranY, this.animKare);
    ctx.globalAlpha = 1;
  }
}
