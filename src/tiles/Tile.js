// ============================================================
// TİLE SINIFI
// Haritadaki tek bir karoyu temsil eder.
// Konum, tip, fizik ve icerik bilgilerini icerir.
// ============================================================

import { KONFIG } from '../config.js';
import { TILE_TIP, TILE_OZELLIK } from './tileTypes.js';
import {
  zeminTileCiz,
  soruBlokCiz,
  blokCiz,
  boruCiz,
  bayrakCiz,
  tasliZeminCiz,
} from '../sprites/spriteRenderer.js';

export class Tile {
  constructor(sutun, satir, tip, ozelIcerik = null) {
    const boyut = KONFIG.TILE_BOYUT;
    this.sutun = sutun;
    this.satir = satir;
    this.x = sutun * boyut;
    this.y = satir * boyut;
    this.genislik = boyut;
    this.yukseklik = boyut;
    this.tip = tip;

    // Temel ozellikler
    const oz = TILE_OZELLIK[tip] || TILE_OZELLIK[TILE_TIP.BOS];
    this.kati = oz.kati;
    this.kiriliyor = oz.kiriliyor;

    // Blok icerigi ('coin' | 'mantar' | 'cicek' | null)
    this.icerik = ozelIcerik !== null ? ozelIcerik : oz.icerik;

    // Durum
    this.kullanildi = false;   // Soru blogu kullanildi mi?
    this.kirildi = false;      // Tugla kirildi mi?
    this.vuruluyor = false;    // Vurulma animasyonu aktif mi?
    this.vuruZaman = 0;        // Vurulma animasyon zamani
  }

  // Bloga vurulunca cagir
  vur() {
    if (!this.vuruluyor) {
      this.vuruluyor = true;
      this.vuruZaman = 0;
    }
  }

  // Animasyonu guncelle
  guncelle(dt) {
    if (this.vuruluyor) {
      this.vuruZaman += dt;
      if (this.vuruZaman >= 0.2) {
        this.vuruluyor = false;
        this.vuruZaman = 0;
      }
    }
  }

  // Tile'i ciz
  ciz(ctx, kameraX, kameraY, animZaman) {
    const boyut = KONFIG.TILE_BOYUT;
    const ekranX = this.x - kameraX;
    const ekranY = this.y - kameraY;

    // Vurulma titresim efekti
    const titresimY = this.vuruluyor
      ? -Math.sin((this.vuruZaman / 0.2) * Math.PI) * 6
      : 0;

    const cizY = ekranY + titresimY;

    switch (this.tip) {
      case TILE_TIP.ZEMIN:
        zeminTileCiz(ctx, ekranX, cizY, boyut);
        break;

      case TILE_TIP.TUGLA:
        if (!this.kirildi) blokCiz(ctx, ekranX, cizY, boyut);
        break;

      case TILE_TIP.SORU_BLOK:
        soruBlokCiz(ctx, ekranX, cizY, boyut, !this.kullanildi, animZaman);
        break;

      case TILE_TIP.SERT_BLOK:
        tasliZeminCiz(ctx, ekranX, cizY, boyut);
        break;

      case TILE_TIP.KULLANILMIS:
        // Kullanilmis blok - koyu kahve
        ctx.fillStyle = '#5C3A1E';
        ctx.fillRect(ekranX, cizY, boyut, boyut);
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(ekranX + boyut - 4, cizY, 4, boyut);
        ctx.fillRect(ekranX, cizY + boyut - 4, boyut, 4);
        break;

      case TILE_TIP.BORU_SOL_UST:
      case TILE_TIP.BORU_SAG_UST:
      case TILE_TIP.BORU_SOL:
      case TILE_TIP.BORU_SAG:
        _boruKismiCiz(ctx, ekranX, cizY, boyut, this.tip);
        break;

      case TILE_TIP.BAYRAK_DIREK:
        // Direk cizimi Level.js'de tum yukseklik bilgisiyle yapilir
        ctx.fillStyle = '#9E9E9E';
        ctx.fillRect(ekranX + boyut / 2 - 2, cizY, 4, boyut);
        break;

      default:
        break; // BOS tile: cizme
    }
  }
}

// Boru kisimlarini ciz
function _boruKismiCiz(ctx, x, y, boyut, tip) {
  const YESIL_KOYU = '#2E7D32';
  const YESIL_ACIK = '#4CAF50';
  const YESIL_PARLAK = '#81C784';

  if (tip === TILE_TIP.BORU_SOL_UST) {
    // Sol ust kose - boru agzi sol yarisi
    ctx.fillStyle = YESIL_KOYU;
    ctx.fillRect(x, y, boyut, boyut);
    // Parlama
    ctx.fillStyle = YESIL_ACIK;
    ctx.fillRect(x + 4, y + 4, boyut / 2 - 8, boyut - 8);
    ctx.fillStyle = YESIL_PARLAK;
    ctx.fillRect(x + 4, y + 4, 4, boyut / 4);
  } else if (tip === TILE_TIP.BORU_SAG_UST) {
    // Sag ust kose - boru agzi sag yarisi
    ctx.fillStyle = YESIL_KOYU;
    ctx.fillRect(x, y, boyut, boyut);
    ctx.fillStyle = YESIL_ACIK;
    ctx.fillRect(x + boyut / 2 + 4, y + 4, boyut / 2 - 8, boyut - 8);
    // Ust cerceve
    ctx.fillStyle = '#1B5E20';
    ctx.fillRect(x, y, boyut * 2, 4); // Bu ust cizgisi 2 tile genisliginde
  } else if (tip === TILE_TIP.BORU_SOL) {
    // Sol govde
    ctx.fillStyle = YESIL_KOYU;
    ctx.fillRect(x, y, boyut, boyut);
    ctx.fillStyle = YESIL_ACIK;
    ctx.fillRect(x + 4, y, boyut / 2 - 6, boyut);
    ctx.fillStyle = YESIL_PARLAK;
    ctx.fillRect(x + 4, y, 4, boyut);
  } else {
    // Sag govde
    ctx.fillStyle = YESIL_KOYU;
    ctx.fillRect(x, y, boyut, boyut);
    ctx.fillStyle = YESIL_ACIK;
    ctx.fillRect(x + boyut / 2 + 2, y, boyut / 2 - 6, boyut);
  }
}
