// ============================================================
// ANA OYUN DOSYASI
// Tum modulleri bir araya getirir.
// Oyun dongusu (game loop), durum yonetimi ve render burada.
// ============================================================

import { KONFIG } from './config.js';
import { GirisYoneticisi } from './input.js';
import { Kamera } from './camera.js';
import { Level } from './levels/Level.js';
import { Mario } from './entities/Mario.js';
import { SesYoneticisi } from './audio/audioManager.js';
import { HUD } from './ui/hud.js';
import { level1 } from './levels/level1.js';
import { level2 } from './levels/level2.js';

// Tum levellar listesi
const LEVELLAR = [level1, level2];

// Oyun durumlari
const OYUN_DURUMU = {
  MENU:         'menu',
  OYNANIYOR:    'oynaniyor',
  OLUM:         'olum',        // Mario oldu, kisa bekleme
  LEVEL_BITTI:  'level_bitti', // Level tamamlandi
  OYUN_BITTI:   'oyun_bitti',  // Tum canlar bitti
};

class Oyun {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Canvas boyutunu ayarla
    this.canvas.width = KONFIG.CANVAS_EN;
    this.canvas.height = KONFIG.CANVAS_BOY;

    // Alt sistemler
    this.giris = new GirisYoneticisi();
    this.kamera = new Kamera();
    this.ses = new SesYoneticisi();
    this.hud = new HUD();
    this.level = new Level();

    // Oyun durumu
    this.durum = OYUN_DURUMU.MENU;
    this.aktifLevelIndex = 0;
    this.mario = null;

    // Zamanlama
    this.oncekiZaman = 0;
    this.beklemeZamani = 0;
    this.levelGecisZamani = 0;

    // Game loop'u baglı tut
    this._dongu = this._dongu.bind(this);

    // Menu: tikla/enter ile baslat
    this._menuGirisiBaglat();

    // Responsive canvas
    this._canvasBoyutlandir();
    window.addEventListener('resize', () => this._canvasBoyutlandir());
  }

  // Yeni bir level baslat
  _levelBaslat(index) {
    this.aktifLevelIndex = index;
    const levelVerisi = LEVELLAR[index];

    // Mario baslangic konumu
    const mx = levelVerisi.marioBaslangic.x * KONFIG.TILE_BOYUT;
    const my = levelVerisi.marioBaslangic.y * KONFIG.TILE_BOYUT;

    if (!this.mario) {
      this.mario = new Mario(mx, my);
    } else {
      // Mario varsa konum/durum sifirla, canlar korunur
      this.mario.baslangicX = mx;
      this.mario.baslangicY = my;
      this.mario.sifirla();
    }

    this.level.yukle(levelVerisi, this.ses);
    this.kamera.x = 0;
    this.kamera.y = 0;
    this.durum = OYUN_DURUMU.OYNANIYOR;
  }

  // Oyunu yeniden baslat (can yeterliyse)
  _yenidenBaslat() {
    if (this.mario.canlar <= 0) {
      // Canlar bitti: game over
      this.mario = null;
      this.durum = OYUN_DURUMU.MENU;
      return;
    }
    // Ayni leveli yeniden yukle
    const levelVerisi = LEVELLAR[this.aktifLevelIndex];
    const mx = levelVerisi.marioBaslangic.x * KONFIG.TILE_BOYUT;
    const my = levelVerisi.marioBaslangic.y * KONFIG.TILE_BOYUT;
    this.mario.baslangicX = mx;
    this.mario.baslangicY = my;
    this.mario.sifirla();
    this.level.yukle(levelVerisi, this.ses);
    this.kamera.x = 0;
    this.durum = OYUN_DURUMU.OYNANIYOR;
  }

  // Sonraki levele gec
  _sonrakiLevel() {
    const sonrakiIndex = this.aktifLevelIndex + 1;
    if (sonrakiIndex < LEVELLAR.length) {
      this._levelBaslat(sonrakiIndex);
    } else {
      // Tum levellar bitti - menu'ye don
      this.mario = null;
      this.durum = OYUN_DURUMU.MENU;
    }
  }

  // Oyun dongusu - her kare calisir
  _dongu(simdi) {
    requestAnimationFrame(this._dongu);

    // Delta time hesapla (maks 100ms - donma/tab switch korumasi)
    const dt = Math.min((simdi - this.oncekiZaman) / 1000, 0.1);
    this.oncekiZaman = simdi;

    this._guncelle(dt);
    this._ciz();
  }

  // Guncelleme
  _guncelle(dt) {
    switch (this.durum) {
      case OYUN_DURUMU.MENU:
        // Menu'de bekle, giris bekleniyor
        break;

      case OYUN_DURUMU.OYNANIYOR:
        // Mario guncelle
        this.mario.guncelle(dt, this.giris, this.level);

        // Level guncelle
        this.level.guncelle(dt, this.giris, this.mario);

        // Kamera guncelle
        this.kamera.guncelle(this.mario, this.level.genislik, this.level.yukseklik);

        // Olum kontrolu
        if (this.mario.oldu) {
          this.durum = OYUN_DURUMU.OLUM;
          this.beklemeZamani = 0;
        }

        // Level tamamlama kontrolu
        if (this.mario.levelTamamlandi) {
          this.durum = OYUN_DURUMU.LEVEL_BITTI;
          this.levelGecisZamani = 0;
        }
        break;

      case OYUN_DURUMU.OLUM:
        // Mario olum animasyonu
        this.mario.guncelle(dt, this.giris, this.level);
        this.beklemeZamani += dt;
        if (this.beklemeZamani >= 2.5) {
          if (this.mario.canlar > 0) {
            this._yenidenBaslat();
          } else {
            this.durum = OYUN_DURUMU.OYUN_BITTI;
            this.ses.oyunBitti();
          }
        }
        break;

      case OYUN_DURUMU.LEVEL_BITTI:
        // Mario ilerlemeye devam etsin
        this.mario.guncelle(dt, this.giris, this.level);
        this.kamera.guncelle(this.mario, this.level.genislik, this.level.yukseklik);
        this.levelGecisZamani += dt;
        if (this.levelGecisZamani >= 3.0) {
          this._sonrakiLevel();
        }
        break;

      case OYUN_DURUMU.OYUN_BITTI:
        this.beklemeZamani += dt;
        // Enter ile menu'ye don
        if (this.beklemeZamani > 3.0) {
          const enterBasildi = this.giris.tuslar.ziplama;
          if (enterBasildi) {
            this.mario = null;
            this.durum = OYUN_DURUMU.MENU;
          }
        }
        break;
    }
  }

  // Cizim
  _ciz() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    switch (this.durum) {
      case OYUN_DURUMU.MENU:
        this.hud.baslaEkrani(ctx);
        break;

      case OYUN_DURUMU.OYNANIYOR:
      case OYUN_DURUMU.OLUM:
      case OYUN_DURUMU.LEVEL_BITTI:
        // Level ciz
        this.level.ciz(ctx, this.kamera, this.canvas.width, this.canvas.height);
        // Mario ciz
        this.mario.ciz(ctx, this.kamera.x, this.kamera.y);
        // HUD ciz (kamera bagimsiz)
        this.hud.ciz(ctx, this.mario, this.level.sure, LEVELLAR[this.aktifLevelIndex].isim);

        // Level tamamlama mesaji
        if (this.durum === OYUN_DURUMU.LEVEL_BITTI) {
          this.hud.mesajGoster(
            ctx,
            'TEBRIKLER!',
            `SKOR: ${this.mario.skor}`,
            'Sonraki level yukleniyor...'
          );
        }

        // Olum mesaji
        if (this.durum === OYUN_DURUMU.OLUM && this.beklemeZamani > 1.0) {
          const canMesaji = this.mario.canlar > 0
            ? `Kalan Can: ${this.mario.canlar}`
            : 'Son can!';
          this.hud.mesajGoster(ctx, 'MARIO OLDU!', canMesaji, '');
        }
        break;

      case OYUN_DURUMU.OYUN_BITTI:
        // Son level manzarasi
        this.level.ciz(ctx, this.kamera, this.canvas.width, this.canvas.height);
        this.hud.mesajGoster(
          ctx,
          'OYUN BİTTİ',
          `SKOR: ${this.mario ? this.mario.skor : 0}`,
          'Devam etmek için SPACE'
        );
        break;
    }
  }

  // Responsive canvas: pencere boyutuna gore olcekle
  _canvasBoyutlandir() {
    const oran = KONFIG.CANVAS_EN / KONFIG.CANVAS_BOY;
    let stil_en = window.innerWidth;
    let stil_boy = window.innerHeight - 80; // Mobil buton alani

    if (stil_en / stil_boy > oran) {
      stil_en = stil_boy * oran;
    } else {
      stil_boy = stil_en / oran;
    }

    this.canvas.style.width = Math.floor(stil_en) + 'px';
    this.canvas.style.height = Math.floor(stil_boy) + 'px';
  }

  // Menu/basla giris olaylari
  _menuGirisiBaglat() {
    const baslat = () => {
      if (this.durum === OYUN_DURUMU.MENU) {
        this.ses._baslat(); // AudioContext baslatma
        this._levelBaslat(0);
      }
    };

    // Klavye Enter veya Space
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        baslat();
      }
    });

    // Canvas tikla
    this.canvas.addEventListener('click', baslat);
    this.canvas.addEventListener('touchstart', baslat, { passive: true });
  }

  // Oyun dongusu'nu baslat
  baslat() {
    requestAnimationFrame((t) => {
      this.oncekiZaman = t;
      requestAnimationFrame(this._dongu);
    });
  }
}

// ============================================================
// UYGULAMA GİRİŞ NOKTASI
// ============================================================
window.addEventListener('load', () => {
  const canvas = document.getElementById('gameCanvas');
  const yuklenmeEkrani = document.getElementById('loadingScreen');

  // Yuklenme ekranini gizle
  if (yuklenmeEkrani) {
    yuklenmeEkrani.style.display = 'none';
  }

  // Oyunu baslat
  const oyun = new Oyun(canvas);
  oyun.baslat();
});
