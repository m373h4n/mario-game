// ============================================================
// MARIO KARAKTERİ
// Oyuncunun kontrol ettigi ana karakter.
// Fizik, durum makinesi, animasyon ve carpisma tepkilerini icerir.
// Coyote time ve jump buffer ile akici oynanis saglar.
// ============================================================

import { Varlik } from './Entity.js';
import { KONFIG } from '../config.js';
import { tileCarpismaCozu, dunyaSinirKontrol, carpisiyor } from '../physics.js';
import { marioyCiz } from '../sprites/spriteRenderer.js';

// Mario'nun boyut durumu
export const MARIO_DURUM = {
  KUCUK: 'kucuk',
  BUYUK: 'buyuk',
};

// Mario'nun hareket durumu (animasyon icin)
const HAREKET = {
  BEKLIYOR:  'bekliyor',
  YURUYOR:   'yuruyor',
  ZIPLIYOR:  'zipliyor',
  DUSUYOR:   'dusuyor',
  KAYIYOR:   'kayiyor',  // Yön degistirirken kayma animasyonu
  OLUYOR:    'oluyor',
};

export class Mario extends Varlik {
  constructor(x, y) {
    // Kucuk Mario boyutlari
    super(x, y, 28, 30);

    // Durum
    this.boyutDurumu = MARIO_DURUM.KUCUK;
    this.hareketDurumu = HAREKET.BEKLIYOR;

    // Can ve skor
    this.canlar = KONFIG.MARIO_CAN;
    this.skor = 0;
    this.coinler = 0;

    // Ziplama ozellikleri
    this.ziplamaTusuBasiliYdi = false;    // Onceki karede basili miydi?
    this.coyoteZaman = 0;                 // Kenardan dustukten sonra ziplama suresi
    this.ziplamaBellek = 0;               // Erken basilan ziplama tusunu hatirlama
    this.zipladimi = false;               // Bu ziplama baslamis mi?

    // Yenilmezlik (hasar alinca kisa sure)
    this.yenilmez = false;
    this.yenilmezZaman = 0;
    this.yanipSonme = 0;                 // Yanip sonme sayaci

    // Olum animasyonu
    this.oldu = false;
    this.olumZaman = 0;

    // Level tamamlama
    this.levelTamamlandi = false;
    this.bayrakAnimZaman = 0;

    // Baslangic konum (yeniden baslama icin)
    this.baslangicX = x;
    this.baslangicY = y;
  }

  // Mario'nun boyutuna gore genislik/yuksekligi ayarla
  _boyutAyarla() {
    if (this.boyutDurumu === MARIO_DURUM.KUCUK) {
      this.yukseklik = 30;
    } else {
      this.yukseklik = 60;
    }
    this.genislik = 28;
  }

  guncelle(dt, input, level) {
    if (!this.aktif) return;

    // Olum animasyonu
    if (this.oldu) {
      this._olumGuncelle(dt);
      return;
    }

    // Level tamamlama animasyonu
    if (this.levelTamamlandi) {
      this._bayrakAnimGuncelle(dt);
      return;
    }

    // Yenilmezlik sayacini guncelle
    if (this.yenilmez) {
      this.yenilmezZaman -= dt;
      this.yanipSonme++;
      if (this.yenilmezZaman <= 0) {
        this.yenilmez = false;
        this.yanipSonme = 0;
      }
    }

    // Yerde olmadiginda coyote timer'i azalt
    if (!this.yerde) {
      this.coyoteZaman -= dt;
    }

    // Ziplama bellegi azalt
    if (this.ziplamaBellek > 0) {
      this.ziplamaBellek -= dt;
    }

    // --- YATAY HAREKET ---
    this._yatayHareket(dt, input);

    // --- ZIPLAMA ---
    this._zipla(input);

    // --- YERÇEKİMİ ---
    this.yercekimiUygula(dt);

    // Ziplama tusunu birakininca yukari hizi kes (degisken ziplama)
    if (!input.basildi('ziplama') && this.hizY < 0) {
      this.hizY *= 0.92; // Yumusak kesme
    }

    // Onceki karedeki yerde durumu sakla (coyote time icin)
    const oncekiYerde = this.yerde;
    this.yerde = false;

    // --- POZİSYON GUNCELLE ---
    this.x += this.hizX * dt;
    this.y += this.hizY * dt;

    // --- TILE CARPISMA ---
    const carpisma = tileCarpismaCozu(this, level.tileMap);

    if (carpisma.yerde) {
      this.yerde = true;
      this.zipladimi = false;
      this.coyoteZaman = 0.1; // Coyote time sifirla (yerde iken gerek yok)
    }

    // Zeminden yeni ayrildiysa coyote time baslat
    if (oncekiYerde && !this.yerde) {
      this.coyoteZaman = 0.1; // 100ms coyote suresi
    }

    // Tavana carpinca (soru blogu, tugla vurmak) - level'a bildir
    if (carpisma.tavana && carpisma.carpistigi) {
      level.bloguVur(carpisma.carpistigi, this);
    }

    // Dunya sinirlari
    dunyaSinirKontrol(this, level.genislik);

    // Ucurumdan dusme kontrolu
    if (this.y > level.yukseklik + 100) {
      this._hasar(level.ses);
    }

    // Animasyon durumunu guncelle
    this._animasyonGuncelle(dt, input);

    // Ziplama tusu durumunu sakla
    this.ziplamaTusuBasiliYdi = input.basildi('ziplama');
  }

  // Yatay hareket fizigi
  _yatayHareket(dt, input) {
    const kosarken = input.basildi('kosma');
    const maxHiz = kosarken ? KONFIG.MARIO_KOSMA_HIZ : KONFIG.MARIO_HIZ;
    const ivme = maxHiz * 8; // Hizlanma ivmesi
    const surtunme = 0.82;   // Surtunme katsayisi

    if (input.basildi('sag')) {
      this.hizX += ivme * dt;
      this.hizX = Math.min(this.hizX, maxHiz);
      this.sagaBakiyor = true;
    } else if (input.basildi('sol')) {
      this.hizX -= ivme * dt;
      this.hizX = Math.max(this.hizX, -maxHiz);
      this.sagaBakiyor = false;
    } else {
      // Surtunme uygula
      this.hizX *= surtunme;
      if (Math.abs(this.hizX) < 5) this.hizX = 0;
    }

    // Kayma durumu: Zit yonde hiz varken tus basinca
    if (
      (input.basildi('sag') && this.hizX < -30) ||
      (input.basildi('sol') && this.hizX > 30)
    ) {
      this.hareketDurumu = HAREKET.KAYIYOR;
    }
  }

  // Ziplama mantigi (coyote time + jump buffer ile)
  _zipla(input) {
    const ziplamaTusuBasili = input.basildi('ziplama');

    // Yeni ziplama tus basimi mi?
    if (ziplamaTusuBasili && !this.ziplamaTusuBasiliYdi) {
      this.ziplamaBellek = 0.12; // 120ms ziplama bellegi
    }

    // Zipla: yerde veya coyote zaman aktifse
    const ziplamabilir = this.yerde || this.coyoteZaman > 0;

    if (this.ziplamaBellek > 0 && ziplamabilir && !this.zipladimi) {
      const zipGuc = this.boyutDurumu === MARIO_DURUM.BUYUK
        ? KONFIG.MARIO_BUYUK_ZIPLAMA
        : KONFIG.MARIO_ZIPLAMA;

      this.hizY = zipGuc;
      this.yerde = false;
      this.coyoteZaman = 0;
      this.ziplamaBellek = 0;
      this.zipladimi = true;
    }
  }

  // Animasyon durumunu guncelle
  _animasyonGuncelle(dt, input) {
    this.animZaman += dt;

    if (!this.yerde) {
      this.hareketDurumu = this.hizY < 0 ? HAREKET.ZIPLIYOR : HAREKET.DUSUYOR;
    } else if (Math.abs(this.hizX) > 10) {
      if (this.hareketDurumu !== HAREKET.KAYIYOR) {
        this.hareketDurumu = HAREKET.YURUYOR;
      }
    } else {
      this.hareketDurumu = HAREKET.BEKLIYOR;
    }

    // Yuruyus animasyon karesi (hiza gore frekans)
    const hiz = Math.abs(this.hizX);
    const frekans = Math.max(4, 12 - hiz * 0.02);
    this.animKare = Math.floor(this.animZaman * frekans) % 3;
  }

  // Hasar al
  _hasar(ses) {
    if (this.yenilmez || this.oldu) return;

    if (ses) ses.hasar();

    if (this.boyutDurumu === MARIO_DURUM.BUYUK) {
      // Buyuk Mario -> Kucuk Mario
      this.boyutDurumu = MARIO_DURUM.KUCUK;
      this._boyutAyarla();
      this._yenilmezBaslat(2.0);
    } else {
      // Kucuk Mario -> Ol
      this._ol(ses);
    }
  }

  // Yenilmezlik modunu baslat
  _yenilmezBaslat(sure) {
    this.yenilmez = true;
    this.yenilmezZaman = sure;
  }

  // Olum
  _ol(ses) {
    if (this.oldu) return;
    this.oldu = true;
    this.olumZaman = 0;
    this.hizX = 0;
    this.hizY = KONFIG.MARIO_ZIPLAMA * 0.8; // Olum ziplama efekti
    this.yerde = false;
    this.canlar--;
    if (ses) ses.olum();
  }

  // Olum animasyonu guncelle
  _olumGuncelle(dt) {
    this.olumZaman += dt;
    // Kisa sure yukari, sonra asagi
    if (this.olumZaman < 0.3) {
      this.y += this.hizY * dt;
      this.hizY += KONFIG.YERCEKIMI * dt;
    } else {
      this.y += this.hizY * dt;
      this.hizY += KONFIG.YERCEKIMI * dt;
    }
  }

  // Bayrak animasyonu
  _bayrakAnimGuncelle(dt) {
    this.bayrakAnimZaman += dt;
    // Mario'nun saga dogru kosmasi
    this.x += 60 * dt;
  }

  // Mantar topla - buyut
  mantarTopla(ses) {
    if (this.boyutDurumu === MARIO_DURUM.KUCUK) {
      this.boyutDurumu = MARIO_DURUM.BUYUK;
      this._boyutAyarla();
      if (ses) ses.mantar();
    }
    this.skor += 1000;
  }

  // Coin topla
  coinTopla(ses) {
    this.coinler++;
    this.skor += KONFIG.SKOR_COIN;
    if (ses) ses.coin();
    // 100 coin = 1 extra can
    if (this.coinler >= 100) {
      this.coinler = 0;
      this.canlar++;
    }
  }

  // Dusmana basti
  dusmanBasti(ses) {
    this.skor += KONFIG.SKOR_DUSMANTEPE;
    // Sekme
    this.hizY = KONFIG.MARIO_ZIPLAMA * 0.5;
    this.yerde = false;
    if (ses) ses.dusmanEz();
  }

  // Dusmana degdi (yandan veya alttan)
  dusmanaDegdi(ses) {
    this._hasar(ses);
  }

  // Level tamamlama
  levelTamamla(ses) {
    if (this.levelTamamlandi) return;
    this.levelTamamlandi = true;
    this.skor += KONFIG.SKOR_LEVEL;
    if (ses) ses.levelBitti();
  }

  // Yeniden baslat
  sifirla() {
    this.x = this.baslangicX;
    this.y = this.baslangicY;
    this.hizX = 0;
    this.hizY = 0;
    this.yerde = false;
    this.oldu = false;
    this.olumZaman = 0;
    this.yenilmez = false;
    this.boyutDurumu = MARIO_DURUM.KUCUK;
    this._boyutAyarla();
    this.levelTamamlandi = false;
    this.sagaBakiyor = true;
  }

  ciz(ctx, kameraX, kameraY) {
    if (!this.aktif) return;

    // Yenilmez modunda yanip son (her 4 karede bir saklan)
    if (this.yenilmez && this.yanipSonme % 8 < 4) return;

    const ekranX = this.x - kameraX;
    const ekranY = this.y - kameraY;

    // Olum animasyonu
    const animKareCiz = this.oldu ? 2 : this.animKare;

    marioyCiz(
      ctx,
      ekranX,
      ekranY,
      this.boyutDurumu,
      animKareCiz,
      this.sagaBakiyor
    );
  }
}
