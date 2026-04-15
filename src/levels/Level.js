// ============================================================
// LEVEL YÖNETİCİSİ
// Level verisini yukler, tum entity'leri yonetir.
// Mario ile tile ve entity carpisma kontrollerini yonetir.
// ============================================================

import { KONFIG } from '../config.js';
import { TileMap } from '../tiles/TileMap.js';
import { TILE_TIP } from '../tiles/tileTypes.js';
import { Goomba } from '../entities/Goomba.js';
import { Koopa } from '../entities/Koopa.js';
import { HaritaCoin, BlokCoin } from '../entities/Coin.js';
import { Mantar } from '../entities/Mushroom.js';
import { carpisiyor, carpismaTarafi } from '../physics.js';
import { bayrakCiz } from '../sprites/spriteRenderer.js';

export class Level {
  constructor() {
    this.tileMap = new TileMap();
    this.genislik = 0;         // Piksel cinsinden
    this.yukseklik = 0;
    this.verisi = null;
    this.entityler = [];       // Tum aktif entity'ler
    this.sure = 400;           // Kalan sure
    this.sureZamanBirikimi = 0;
    this.tamamlandi = false;
    this.ses = null;           // AudioManager referansi
  }

  // Level verisini yukle ve entity'leri olustur
  yukle(levelVerisi, ses = null) {
    this.verisi = levelVerisi;
    this.ses = ses;
    this.sure = levelVerisi.sure;
    this.sureZamanBirikimi = 0;
    this.tamamlandi = false;
    this.entityler = [];

    // Tile haritasini yukle
    this.tileMap.yukle(levelVerisi);
    this.genislik  = this.tileMap.pikselGenislik;
    this.yukseklik = this.tileMap.pikselYukseklik;

    // Dusmanlari olustur
    for (const d of (levelVerisi.dusmanlar || [])) {
      const x = d.x * KONFIG.TILE_BOYUT;
      const y = d.y * KONFIG.TILE_BOYUT;
      if (d.tip === 'goomba') {
        this.entityler.push(new Goomba(x, y));
      } else if (d.tip === 'koopa') {
        this.entityler.push(new Koopa(x, y));
      }
    }

    // Haritadaki serbest coinleri olustur
    for (const c of (levelVerisi.coinler || [])) {
      const x = c.x * KONFIG.TILE_BOYUT + (KONFIG.TILE_BOYUT - 20) / 2;
      const y = c.y * KONFIG.TILE_BOYUT + 4;
      this.entityler.push(new HaritaCoin(x, y));
    }
  }

  // Her kare guncelle
  guncelle(dt, input, mario) {
    if (!mario.oldu && !mario.levelTamamlandi) {
      // Sure sayaci
      this.sureZamanBirikimi += dt;
      if (this.sureZamanBirikimi >= 1.0) {
        this.sure--;
        this.sureZamanBirikimi = 0;
        if (this.sure <= 0) {
          mario._ol(this.ses); // Sure bitti = ol
        }
      }
    }

    // Tile haritasini guncelle (animasyonlar)
    this.tileMap.guncelle(dt);

    // Tum entity'leri guncelle
    for (const entity of this.entityler) {
      if (entity.aktif) {
        entity.guncelle(dt, input, this);
      }
    }

    // Etkin olmayan entity'leri temizle
    this._temizle();

    // Mario ile entity carpisma kontrolleri
    this._marioEntityCarpisma(mario);

    // Mario ile bayrak carpisma
    this._bayrakKontrol(mario);
  }

  // Mario ile dusmanlar ve toplanabilirler arasindaki carpisma
  _marioEntityCarpisma(mario) {
    if (mario.oldu || mario.levelTamamlandi) return;

    const marioKutu = mario.sinirKutusu();

    for (const entity of this.entityler) {
      if (!entity.aktif) continue;
      if (!carpisiyor(marioKutu, entity.sinirKutusu())) continue;

      // Coin toplama
      if (entity instanceof HaritaCoin && !entity.toplandi) {
        entity.topla(mario, this.ses);
        continue;
      }

      // Mantar toplama
      if (entity instanceof Mantar && !entity.toplandi && !entity.cikiyor) {
        entity.topla(mario, this.ses);
        continue;
      }

      // Dusman carpisma (Goomba veya Koopa)
      if (entity instanceof Goomba || entity instanceof Koopa) {
        const yon = carpismaTarafi(marioKutu, entity.sinirKutusu());

        if (entity instanceof Goomba) {
          if (!entity.ezildi) {
            if (yon === 'alt' && mario.hizY > 0) {
              // Ustune basinca ez
              entity.ez(this.ses);
              mario.dusmanBasti(this.ses);
              mario.skor += entity.puan;
            } else if (yon !== 'alt') {
              // Yandan veya alttan carpisma = hasar
              mario.dusmanaDegdi(this.ses);
            }
          }
        } else if (entity instanceof Koopa) {
          if (entity.kayanKabukMu()) {
            // Kayan kabuk: Mario'ya hasar verir
            mario.dusmanaDegdi(this.ses);
          } else if (entity.kabukMu()) {
            if (yon === 'alt' && mario.hizY > 0) {
              // Kabuga giren Koopa'nin ustune bas = kabugu kaydir
              const yonSag = mario.x < entity.x;
              entity.kabugaYan(this.ses, yonSag);
              mario.dusmanBasti(this.ses);
              mario.skor += entity.puan_kabuk;
            } else {
              // Yana dokunma = kabugu kaydir
              const yonSag = mario.x < entity.x;
              entity.kabugaYan(this.ses, yonSag);
            }
          } else {
            // Normal Koopa
            if (yon === 'alt' && mario.hizY > 0) {
              entity.kabugaGir(this.ses);
              mario.dusmanBasti(this.ses);
              mario.skor += entity.puan;
            } else if (yon !== 'alt') {
              mario.dusmanaDegdi(this.ses);
            }
          }
        }
      }
    }
  }

  // Bayrak ile carpisma kontrolu
  _bayrakKontrol(mario) {
    if (!this.verisi.bayrak || mario.levelTamamlandi || mario.oldu) return;

    const bf = this.verisi.bayrak;
    const bayrakX = bf.x * KONFIG.TILE_BOYUT;
    const bayrakY = bf.y * KONFIG.TILE_BOYUT;

    // Mario'nun bayrak diregine ulasip ulasmadigini kontrol et
    if (mario.x + mario.genislik >= bayrakX && mario.x <= bayrakX + 16) {
      mario.levelTamamla(this.ses);
    }
  }

  // Soru blogu / tugla vurma
  bloguVur(tile, mario) {
    if (!tile || tile.kullanildi || tile.kirildi) return;

    if (tile.tip === TILE_TIP.SORU_BLOK) {
      // Soru blogu: icerigini cıkar
      tile.vur();
      tile.kullanildi = true;
      tile.tip = TILE_TIP.KULLANILMIS;
      tile.kati = true;
      this._blokIcerikiCikar(tile, mario);
      if (this.ses) this.ses.blokVur();

    } else if (tile.tip === TILE_TIP.TUGLA) {
      tile.vur();
      if (mario.boyutDurumu === 'buyuk') {
        // Buyuk Mario tuglalari kirar
        tile.kirildi = true;
        tile.kati = false;
        // Parcacik efekti (skor da verir)
        mario.skor += 50;
        if (this.ses) this.ses.tuglaKir();
      } else {
        // Kucuk Mario tuglayi kiramaz, sadece sekmesi
        if (this.ses) this.ses.blokVur();
      }
    }
  }

  // Bloktan nesne cikar (coin, mantar, cicek)
  _blokIcerikiCikar(tile, mario) {
    const icerik = tile.icerik;
    const x = tile.x + (KONFIG.TILE_BOYUT - 28) / 2;
    const y = tile.y - KONFIG.TILE_BOYUT;

    if (icerik === 'coin' || !icerik) {
      // Coin firlatici animasyon
      const blokCoin = new BlokCoin(tile.x + 6, tile.y);
      this.entityler.push(blokCoin);
      mario.coinTopla(this.ses);
    } else if (icerik === 'mantar') {
      // Mantar cik
      const mantar = new Mantar(x, tile.y);
      this.entityler.push(mantar);
    }
  }

  // Etkin olmayan entity'leri listeden cikar
  _temizle() {
    this.entityler = this.entityler.filter(e => e.aktif);
  }

  // Her seyi ciz
  ciz(ctx, kamera, canvasEn, canvasBoy) {
    // Arka plan
    ctx.fillStyle = this.verisi.arkaplanRengi;
    ctx.fillRect(0, 0, canvasEn, canvasBoy);

    const kX = kamera.x;
    const kY = kamera.y;

    // Dekorasyonlar (arkada)
    this.tileMap.dekorCiz(ctx, kX, this.verisi.dekor);

    // Tile haritasi
    this.tileMap.ciz(ctx, kX, kY, canvasEn, canvasBoy);

    // Bayrak
    this._bayrakCiz(ctx, kX, kY);

    // Entity'ler
    for (const entity of this.entityler) {
      if (entity.aktif) {
        entity.ciz(ctx, kX, kY);
      }
    }
  }

  // Bayrak cizimi
  _bayrakCiz(ctx, kX, kY) {
    if (!this.verisi.bayrak) return;
    const bf = this.verisi.bayrak;
    const ekranX = bf.x * KONFIG.TILE_BOYUT - kX;
    const ekranY = bf.y * KONFIG.TILE_BOYUT - kY;
    // Bayrak diregi yuksekligi
    const direkYukseklik = (14 - bf.y) * KONFIG.TILE_BOYUT;
    bayrakCiz(ctx, ekranX, ekranY, KONFIG.TILE_BOYUT, direkYukseklik);
  }
}
