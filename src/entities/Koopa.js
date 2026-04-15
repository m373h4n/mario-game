// ============================================================
// KOOPA TROOPA DUSMANI
// Goomba'dan daha karmasik. Ustune basilinca kabuguna girer.
// Kabuk tekmelenince hizla kayar ve diger dusmanlari ezer.
// ============================================================

import { Varlik } from './Entity.js';
import { tileCarpismaCozu } from '../physics.js';
import { koopaCiz } from '../sprites/spriteRenderer.js';

const KOOPA_HIZ = 60;       // Normal yuruyus hizi
const KABUK_HIZ = 280;      // Tekmelenmis kabuk hizi
const KABUK_BEKLEME = 5.0;  // Kabukta bekleme suresi (sonra tekrar cikma)

const DURUM = {
  YURUYOR:      'yuruyor',
  KABUKTA:      'kabukta',      // Kabuga girdi, bekliyor
  KAYAN_KABUK:  'kayan_kabuk',  // Kabuk kaynyor
};

export class Koopa extends Varlik {
  constructor(x, y) {
    super(x, y, 28, 36);
    this.hizX = -KOOPA_HIZ;
    this.durum = DURUM.YURUYOR;
    this.kabukBeklemeZaman = 0;
    this.puan = 100;
    this.puan_kabuk = 500;
  }

  guncelle(dt, input, level) {
    if (!this.aktif) return;

    // Yerçekimi
    this.yercekimiUygula(dt);

    if (this.durum === DURUM.KABUKTA) {
      // Kabukta bekliyorsa sure say
      this.kabukBeklemeZaman += dt;
      if (this.kabukBeklemeZaman >= KABUK_BEKLEME) {
        // Kabuktan tekrar cikmaya calis
        this.durum = DURUM.YURUYOR;
        this.hizX = -KOOPA_HIZ;
        this._boyutAyarlaYuruyor();
      }

      // Dikey fizigi uygula
      this.y += this.hizY * dt;
      tileCarpismaCozu(this, level.tileMap);
      return;
    }

    // Yuruyus veya kayan kabuk
    this.x += this.hizX * dt;
    this.y += this.hizY * dt;

    const carpisma = tileCarpismaCozu(this, level.tileMap);

    if (carpisma.yerde) this.yerde = true;

    // Duvara carptiysa yon degistir
    if (carpisma.duvara) {
      this.hizX = -this.hizX;
    }

    // Kayan kabuk: karsisina cikan dusmanlara carpmasi level tarafindan islenir

    // Platform kenari kontrolu (sadece yuruyorken)
    if (this.durum === DURUM.YURUYOR && this.yerde) {
      const onundekiX = this.hizX > 0
        ? this.x + this.genislik + 2
        : this.x - 2;
      const ayakY = this.y + this.yukseklik + 1;
      const onTile = level.tileMap.pikseldenTile(onundekiX, ayakY);
      if (!onTile || !onTile.kati) {
        this.hizX = -this.hizX;
      }
    }

    this.sagaBakiyor = this.hizX > 0;

    // Dunya sinirlari
    if (this.x < 0) {
      this.x = 0;
      this.hizX = Math.abs(this.hizX);
    }

    // Animasyon (sadece yuruyorken)
    if (this.durum === DURUM.YURUYOR) {
      this.animasyonGuncelle(dt, 6);
    }

    // Ucurum kontrolu
    if (this.y > level.yukseklik + 50) {
      this.aktif = false;
    }
  }

  // Mario ustune bastinda: kabuga gir
  kabugaGir(ses) {
    if (this.durum === DURUM.YURUYOR) {
      this.durum = DURUM.KABUKTA;
      this.hizX = 0;
      this.kabukBeklemeZaman = 0;
      this._boyutAyarlaKabuk();
      if (ses) ses.dusmanEz();
    } else if (this.durum === DURUM.KABUKTA) {
      // Duruyorken tekmelenirse kaydir
      this.kabugaYan(ses);
    } else if (this.durum === DURUM.KAYAN_KABUK) {
      // Hareket eden kabubu durdur
      this.durum = DURUM.KABUKTA;
      this.hizX = 0;
      this.kabukBeklemeZaman = 0;
    }
  }

  // Kabuga yan carpisma - kabugu kaydir
  kabugaYan(ses, yonSag = true) {
    this.durum = DURUM.KAYAN_KABUK;
    this.hizX = yonSag ? KABUK_HIZ : -KABUK_HIZ;
    this.kabukBeklemeZaman = 0;
    if (ses) ses.dusmanEz();
  }

  // Durum boyut ayarlamalari
  _boyutAyarlaKabuk() {
    this.yukseklik = 28; // Kabukta daha alçak
    this.y += 8; // Altta birak
  }

  _boyutAyarlaYuruyor() {
    this.yukseklik = 36;
    this.y -= 8;
  }

  kayanKabukMu() {
    return this.durum === DURUM.KAYAN_KABUK;
  }

  kabukMu() {
    return this.durum === DURUM.KABUKTA || this.durum === DURUM.KAYAN_KABUK;
  }

  ciz(ctx, kameraX, kameraY) {
    if (!this.aktif) return;
    const ekranX = this.x - kameraX;
    const ekranY = this.y - kameraY;
    koopaCiz(ctx, ekranX, ekranY, this.animKare, this.kabukMu(), this.sagaBakiyor);
  }
}
