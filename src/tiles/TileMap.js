// ============================================================
// TİLE HARİTASI
// Level verisinden 2D tile grid'i olusturur.
// Performans icin sadece gorunen tile'lari cizer (frustum culling).
// Tile sorgu metodlari ile diger sistemlerin haritaya erisimini saglar.
// ============================================================

import { KONFIG } from '../config.js';
import { Tile } from './Tile.js';
import { TILE_TIP } from './tileTypes.js';

export class TileMap {
  constructor() {
    this.tiles = [];         // 2D dizi: tiles[satir][sutun]
    this.sutunlar = 0;
    this.satirlar = 0;
    this.pikselGenislik = 0;
    this.pikselYukseklik = 0;
    this.animZaman = 0;      // Animasyonlu tile'lar icin
  }

  // Level verisinden haritayi yukle
  yukle(levelVerisi) {
    const grid = levelVerisi.harita;
    this.satirlar = grid.length;
    this.sutunlar = grid[0].length;
    this.pikselGenislik = this.sutunlar * KONFIG.TILE_BOYUT;
    this.pikselYukseklik = this.satirlar * KONFIG.TILE_BOYUT;
    this.tiles = [];

    // Blok ozel iceriklerini al
    const icerikler = levelVerisi.blokIcerikleri || {};

    for (let satir = 0; satir < this.satirlar; satir++) {
      this.tiles[satir] = [];
      for (let sutun = 0; sutun < this.sutunlar; sutun++) {
        const tip = grid[satir][sutun];
        const anahtaar = `${sutun},${satir}`;
        const ozelIcerik = icerikler[anahtaar] ? icerikler[anahtaar].tip : null;
        this.tiles[satir][sutun] = new Tile(sutun, satir, tip, ozelIcerik);
      }
    }
  }

  // Tile sorgula (grid koordinatlari)
  getTile(sutun, satir) {
    if (satir < 0 || satir >= this.satirlar) return null;
    if (sutun < 0 || sutun >= this.sutunlar) return null;
    return this.tiles[satir][sutun];
  }

  // Piksel koordinatindan tile dondur
  pikseldenTile(pikselX, pikselY) {
    const sutun = Math.floor(pikselX / KONFIG.TILE_BOYUT);
    const satir = Math.floor(pikselY / KONFIG.TILE_BOYUT);
    return this.getTile(sutun, satir);
  }

  // Tile'i guncelle (animasyonlar)
  guncelle(dt) {
    this.animZaman += dt;

    // Sadece vurulma animasyonu olan tile'lari guncelle
    for (let satir = 0; satir < this.satirlar; satir++) {
      for (let sutun = 0; sutun < this.sutunlar; sutun++) {
        const tile = this.tiles[satir][sutun];
        if (tile.vuruluyor) tile.guncelle(dt);
      }
    }
  }

  // Haritayi ciz - sadece gorunen alani ciz (performans)
  ciz(ctx, kameraX, kameraY, canvasEn, canvasBoy) {
    const boyut = KONFIG.TILE_BOYUT;

    // Gorunen tile araligini hesapla
    const ilkSutun = Math.max(0, Math.floor(kameraX / boyut) - 1);
    const sonSutun  = Math.min(this.sutunlar, Math.ceil((kameraX + canvasEn) / boyut) + 1);
    const ilkSatir = Math.max(0, Math.floor(kameraY / boyut) - 1);
    const sonSatir  = Math.min(this.satirlar, Math.ceil((kameraY + canvasBoy) / boyut) + 1);

    // Sadece gorunen tile'lari ciz
    for (let satir = ilkSatir; satir < sonSatir; satir++) {
      for (let sutun = ilkSutun; sutun < sonSutun; sutun++) {
        const tile = this.tiles[satir][sutun];
        if (tile.tip !== TILE_TIP.BOS && !tile.kirildi) {
          tile.ciz(ctx, kameraX, kameraY, this.animZaman);
        }
      }
    }
  }

  // Arka plan dekorasyonlarini ciz (bulut, tepe, cali)
  dekorCiz(ctx, kameraX, dekorlar) {
    if (!dekorlar) return;
    for (const d of dekorlar) {
      const ekranX = d.x * KONFIG.TILE_BOYUT - kameraX;
      const ekranY = d.y * KONFIG.TILE_BOYUT;
      _dekorCiz(ctx, ekranX, ekranY, d.tip, d.boyut);
    }
  }
}

// Dekorasyon cizim yardimcilari
function _dekorCiz(ctx, x, y, tip, boyut) {
  const b = boyut === 'buyuk' ? 1.6 : 1;

  if (tip === 'bulut') {
    _bulutCiz(ctx, x, y, b);
  } else if (tip === 'tepe') {
    _tepeCiz(ctx, x, y, b);
  } else if (tip === 'cali') {
    _caliCiz(ctx, x, y, b);
  }
}

function _bulutCiz(ctx, x, y, olcek) {
  const w = 64 * olcek;
  const h = 36 * olcek;
  ctx.fillStyle = '#FFFFFF';
  // Bulut sekli: ucgen daire
  ctx.beginPath();
  ctx.arc(x + w * 0.25, y + h * 0.6, h * 0.45, 0, Math.PI * 2);
  ctx.arc(x + w * 0.5,  y + h * 0.4, h * 0.55, 0, Math.PI * 2);
  ctx.arc(x + w * 0.75, y + h * 0.6, h * 0.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(x, y + h * 0.6, w, h * 0.4);
}

function _tepeCiz(ctx, x, y, olcek) {
  const w = 96 * olcek;
  const h = 64 * olcek;
  ctx.fillStyle = '#4CAF50'; // Koyu yesil
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x + w / 2, y);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#388E3C'; // Daha koyu golvge
  ctx.beginPath();
  ctx.moveTo(x + w * 0.3, y + h * 0.4);
  ctx.lineTo(x + w / 2, y);
  ctx.lineTo(x + w * 0.7, y + h * 0.4);
  ctx.closePath();
  ctx.fill();
}

function _caliCiz(ctx, x, y, olcek) {
  const w = 48 * olcek;
  const h = 32 * olcek;
  ctx.fillStyle = '#388E3C';
  ctx.beginPath();
  ctx.arc(x + w * 0.3, y + h * 0.5, h * 0.55, 0, Math.PI * 2);
  ctx.arc(x + w * 0.7, y + h * 0.5, h * 0.55, 0, Math.PI * 2);
  ctx.arc(x + w * 0.5, y + h * 0.3, h * 0.5,  0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(x, y + h * 0.5, w, h * 0.5);

  // Parlama
  ctx.fillStyle = '#4CAF50';
  ctx.beginPath();
  ctx.arc(x + w * 0.35, y + h * 0.4, h * 0.2, 0, Math.PI * 2);
  ctx.fill();
}
