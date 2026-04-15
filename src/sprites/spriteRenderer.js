// ============================================================
// SPRİTE RENDERER - CANVAS İLE PİKSEL ART ÇİZİMİ
// Harici resim dosyasi kullanmadan, Canvas 2D API ile
// tum karakterleri ve objeleri pikseller halinde cizer.
// ============================================================

// --- RENK PALETİ ---
const RENKLER = {
  // Mario renkleri
  mario_deri: '#FDA050',
  mario_kirmizi: '#E52521',
  mario_kahve: '#7B3F00',
  mario_mavi: '#3A6BC9',

  // Goomba renkleri
  goomba_kahve: '#A05000',
  goomba_koyu: '#6B3000',
  goomba_goz: '#000',

  // Koopa renkleri
  koopa_yesil: '#2E7D32',
  koopa_acik_yesil: '#66BB6A',
  koopa_sari: '#FDD835',
  koopa_deri: '#FDA050',

  // Tile renkleri
  zemin: '#E0A060',
  zemin_ust: '#8B4513',
  blok: '#C8903C',
  blok_koyu: '#8B5A1A',
  soru_blok: '#F0A000',
  soru_blok_icerik: '#FFFF00',
  boru_yesil: '#2E7D32',
  boru_acik: '#4CAF50',
  goksi: '#5C94FC',
  tasli_zemin: '#888888',
  tasli_koyu: '#555555',

  // Coin rengi
  coin_sari: '#FFD700',
  coin_acik: '#FFF176',

  // Bayrak
  bayrak_gri: '#9E9E9E',
  bayrak_yesil: '#2E7D32',
  bayrak_acik: '#4CAF50',

  // Mantar renkleri
  mantar_kirmizi: '#E53935',
  mantar_bey: '#FFFFFF',
  mantar_kahve: '#795548',
};

// ============================================================
// MARIO ÇİZİMİ
// durum: 'kucuk' | 'buyuk' | 'ate'
// animKare: animasyon karesi (0, 1, 2...)
// yukaBak: true=saga, false=sola
// ============================================================
export function marioyCiz(ctx, x, y, durum, animKare, sagaBak) {
  const px = Math.floor(x);
  const py = Math.floor(y);

  ctx.save();

  // Sola bakiyorsa aynala
  if (!sagaBak) {
    ctx.translate(px + 16, py);
    ctx.scale(-1, 1);
    ctx.translate(-16, 0);
  } else {
    ctx.translate(px, py);
  }

  if (durum === 'kucuk') {
    _marioKucukCiz(ctx, animKare);
  } else {
    _marioBuyukCiz(ctx, animKare);
  }

  ctx.restore();
}

// Kucuk Mario sprite (16x16 grid, 2px piksel)
function _marioKucukCiz(ctx, kare) {
  const p = 2; // Piksel buyutme carpani

  // Sapka (kirmizi)
  _piksel(ctx, 4, 0, 8, 2, RENKLER.mario_kirmizi, p);

  // Yuz (deri)
  _piksel(ctx, 2, 2, 12, 6, RENKLER.mario_deri, p);

  // Sac ve biyik (kahve)
  _piksel(ctx, 2, 2, 6, 2, RENKLER.mario_kahve, p);
  _piksel(ctx, 2, 4, 2, 2, RENKLER.mario_kahve, p);
  _piksel(ctx, 4, 4, 8, 2, RENKLER.mario_kahve, p);

  // Gozler
  _piksel(ctx, 10, 4, 2, 2, '#000', p);

  // Govde (mavi tululum)
  if (kare === 0) {
    // Durma pozu
    _piksel(ctx, 2, 8, 12, 4, RENKLER.mario_mavi, p);
    // Ayaklar (kirmizi)
    _piksel(ctx, 0, 12, 6, 4, RENKLER.mario_kirmizi, p);
    _piksel(ctx, 8, 12, 6, 4, RENKLER.mario_kirmizi, p);
  } else if (kare === 1) {
    // Yuruyen poz 1
    _piksel(ctx, 2, 8, 12, 4, RENKLER.mario_mavi, p);
    _piksel(ctx, 0, 12, 8, 4, RENKLER.mario_kirmizi, p);
    _piksel(ctx, 10, 12, 4, 2, RENKLER.mario_kirmizi, p);
  } else {
    // Ziplayan poz
    _piksel(ctx, 2, 8, 12, 4, RENKLER.mario_mavi, p);
    _piksel(ctx, 0, 10, 6, 2, RENKLER.mario_kirmizi, p);
    _piksel(ctx, 10, 12, 6, 4, RENKLER.mario_kirmizi, p);
  }
}

// Buyuk Mario sprite (16x24 grid, 2px piksel)
function _marioBuyukCiz(ctx, kare) {
  const p = 2;

  // Sapka
  _piksel(ctx, 4, 0, 8, 2, RENKLER.mario_kirmizi, p);

  // Yuz
  _piksel(ctx, 2, 2, 12, 6, RENKLER.mario_deri, p);

  // Sac/biyik
  _piksel(ctx, 2, 2, 6, 2, RENKLER.mario_kahve, p);
  _piksel(ctx, 4, 4, 8, 2, RENKLER.mario_kahve, p);

  // Gozler
  _piksel(ctx, 10, 4, 2, 2, '#000', p);

  // Govde
  _piksel(ctx, 2, 8, 12, 8, RENKLER.mario_mavi, p);
  _piksel(ctx, 4, 10, 8, 4, RENKLER.mario_kirmizi, p);

  if (kare === 0) {
    // Durma
    _piksel(ctx, 0, 16, 6, 4, RENKLER.mario_kirmizi, p);
    _piksel(ctx, 8, 16, 6, 4, RENKLER.mario_kirmizi, p);
    _piksel(ctx, 2, 20, 4, 4, RENKLER.mario_kahve, p);
    _piksel(ctx, 10, 20, 4, 4, RENKLER.mario_kahve, p);
  } else {
    // Yuruyen/ziplayan
    _piksel(ctx, 0, 16, 8, 4, RENKLER.mario_kirmizi, p);
    _piksel(ctx, 10, 18, 4, 2, RENKLER.mario_kirmizi, p);
    _piksel(ctx, 2, 20, 4, 4, RENKLER.mario_kahve, p);
    _piksel(ctx, 8, 22, 4, 2, RENKLER.mario_kahve, p);
  }
}

// ============================================================
// GOOMBA ÇİZİMİ
// ============================================================
export function goombaCiz(ctx, x, y, animKare, olmus) {
  const px = Math.floor(x);
  const py = Math.floor(y);
  const p = 2;

  ctx.save();
  ctx.translate(px, py);

  if (olmus) {
    // Ezilmis Goomba - duz bir sekil
    _piksel(ctx, 0, 8, 16, 4, RENKLER.goomba_kahve, p);
    _piksel(ctx, 2, 10, 12, 2, RENKLER.goomba_koyu, p);
    ctx.restore();
    return;
  }

  // Govde (kahverengi oval)
  _piksel(ctx, 2, 4, 12, 8, RENKLER.goomba_kahve, p);
  _piksel(ctx, 0, 6, 16, 6, RENKLER.goomba_kahve, p);

  // Gozler (beyaz + siyah)
  _piksel(ctx, 2, 6, 4, 4, '#fff', p);
  _piksel(ctx, 10, 6, 4, 4, '#fff', p);
  _piksel(ctx, 2, 7, 2, 3, '#000', p); // Sol goz bebegi
  _piksel(ctx, 12, 7, 2, 3, '#000', p); // Sag goz bebegi

  // Kaslar (sinirli ifade)
  _piksel(ctx, 1, 5, 5, 1, RENKLER.goomba_koyu, p);
  _piksel(ctx, 10, 5, 5, 1, RENKLER.goomba_koyu, p);

  // Ayaklar (animasyona gore)
  if (animKare % 2 === 0) {
    _piksel(ctx, 0, 12, 6, 4, RENKLER.goomba_koyu, p);
    _piksel(ctx, 10, 14, 6, 2, RENKLER.goomba_koyu, p);
  } else {
    _piksel(ctx, 0, 14, 6, 2, RENKLER.goomba_koyu, p);
    _piksel(ctx, 10, 12, 6, 4, RENKLER.goomba_koyu, p);
  }

  ctx.restore();
}

// ============================================================
// KOOPA ÇİZİMİ
// ============================================================
export function koopaCiz(ctx, x, y, animKare, kabukMu, sagaBak) {
  const px = Math.floor(x);
  const py = Math.floor(y);
  const p = 2;

  ctx.save();

  if (!sagaBak) {
    ctx.translate(px + 16, py);
    ctx.scale(-1, 1);
    ctx.translate(-16, 0);
  } else {
    ctx.translate(px, py);
  }

  if (kabukMu) {
    // Sadece kabuk goster
    _piksel(ctx, 2, 4, 12, 12, RENKLER.koopa_yesil, p);
    _piksel(ctx, 4, 2, 8, 14, RENKLER.koopa_yesil, p);
    _piksel(ctx, 6, 6, 4, 8, RENKLER.koopa_acik_yesil, p);
    ctx.restore();
    return;
  }

  // Bas (sari)
  _piksel(ctx, 4, 2, 8, 6, RENKLER.koopa_sari, p);

  // Gozler
  _piksel(ctx, 10, 3, 2, 2, '#fff', p);
  _piksel(ctx, 10, 4, 1, 1, '#000', p);

  // Kabuk (yesil)
  _piksel(ctx, 2, 6, 12, 10, RENKLER.koopa_yesil, p);
  _piksel(ctx, 4, 8, 8, 6, RENKLER.koopa_acik_yesil, p);

  // Ayaklar
  if (animKare % 2 === 0) {
    _piksel(ctx, 0, 14, 6, 4, RENKLER.koopa_sari, p);
    _piksel(ctx, 10, 16, 6, 2, RENKLER.koopa_sari, p);
  } else {
    _piksel(ctx, 0, 16, 6, 2, RENKLER.koopa_sari, p);
    _piksel(ctx, 10, 14, 6, 4, RENKLER.koopa_sari, p);
  }

  ctx.restore();
}

// ============================================================
// COİN ÇİZİMİ
// ============================================================
export function coinCiz(ctx, x, y, animKare) {
  const px = Math.floor(x);
  const py = Math.floor(y);
  const p = 2;

  // Animasyona gore coin genisligi degisir (donme efekti)
  const genislikler = [16, 12, 6, 2, 6, 12]; // Donme kareleri
  const genislik = genislikler[animKare % genislikler.length];
  const solOffset = (16 - genislik) / 2;

  ctx.save();
  ctx.translate(px, py);

  _piksel(ctx, solOffset, 2, genislik, 12, RENKLER.coin_sari, p);
  if (genislik > 6) {
    _piksel(ctx, solOffset + 2, 4, genislik - 4, 8, RENKLER.coin_acik, p);
  }

  ctx.restore();
}

// ============================================================
// MANTAR ÇİZİMİ
// ============================================================
export function mantarCiz(ctx, x, y) {
  const px = Math.floor(x);
  const py = Math.floor(y);
  const p = 2;

  ctx.save();
  ctx.translate(px, py);

  // Sapka (kirmizi + beyaz benekler)
  _piksel(ctx, 2, 0, 12, 8, RENKLER.mantar_kirmizi, p);
  _piksel(ctx, 0, 4, 16, 6, RENKLER.mantar_kirmizi, p);
  // Beyaz benekler
  _piksel(ctx, 2, 2, 3, 3, RENKLER.mantar_bey, p);
  _piksel(ctx, 10, 1, 3, 3, RENKLER.mantar_bey, p);
  _piksel(ctx, 6, 4, 2, 2, RENKLER.mantar_bey, p);

  // Govde (beyaz)
  _piksel(ctx, 2, 9, 12, 7, RENKLER.mantar_bey, p);
  _piksel(ctx, 0, 10, 16, 4, RENKLER.mantar_bey, p);

  // Gozler
  _piksel(ctx, 5, 10, 2, 2, '#000', p);
  _piksel(ctx, 9, 10, 2, 2, '#000', p);

  ctx.restore();
}

// ============================================================
// TİLE ÇİZİM FONKSİYONLARI
// ============================================================

// Zemin tile (kahverengi blok)
export function zeminTileCiz(ctx, x, y, boyut) {
  const px = Math.floor(x);
  const py = Math.floor(y);

  // Ana zemin rengi
  ctx.fillStyle = RENKLER.zemin;
  ctx.fillRect(px, py, boyut, boyut);

  // Ust desen
  ctx.fillStyle = RENKLER.zemin_ust;
  ctx.fillRect(px, py, boyut, 4);

  // Kenarlık golge efekti
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fillRect(px + boyut - 3, py, 3, boyut);
  ctx.fillRect(px, py + boyut - 3, boyut, 3);
}

// Soru blogu (?) - aktif veya bos
export function soruBlokCiz(ctx, x, y, boyut, dolu, animZaman) {
  const px = Math.floor(x);
  const py = Math.floor(y);

  if (dolu) {
    // Sarı titresim animasyonu
    const titresim = Math.sin(animZaman * 6) * 1;
    ctx.fillStyle = RENKLER.soru_blok;
    ctx.fillRect(px, py + titresim, boyut, boyut);

    // Soru isareti
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${boyut * 0.6}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', px + boyut / 2, py + boyut / 2 + titresim);
  } else {
    // Bos blok (koyu)
    ctx.fillStyle = RENKLER.blok_koyu;
    ctx.fillRect(px, py, boyut, boyut);
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(px + boyut - 4, py, 4, boyut);
    ctx.fillRect(px, py + boyut - 4, boyut, 4);
  }
}

// Normal blok
export function blokCiz(ctx, x, y, boyut) {
  const px = Math.floor(x);
  const py = Math.floor(y);

  ctx.fillStyle = RENKLER.blok;
  ctx.fillRect(px, py, boyut, boyut);

  // Izgara deseni
  ctx.strokeStyle = RENKLER.blok_koyu;
  ctx.lineWidth = 2;
  ctx.strokeRect(px + 1, py + 1, boyut - 2, boyut - 2);
  ctx.beginPath();
  ctx.moveTo(px + boyut / 2, py);
  ctx.lineTo(px + boyut / 2, py + boyut);
  ctx.moveTo(px, py + boyut / 2);
  ctx.lineTo(px + boyut, py + boyut / 2);
  ctx.stroke();
}

// Boru
export function boruCiz(ctx, x, y, boyut, yukseklik) {
  const px = Math.floor(x);
  const py = Math.floor(y);

  // Boru govdesi
  ctx.fillStyle = RENKLER.boru_yesil;
  ctx.fillRect(px + 2, py + boyut, boyut * 2 - 4, yukseklik - boyut);

  // Boru ustu (daha genis)
  ctx.fillStyle = RENKLER.boru_yesil;
  ctx.fillRect(px, py, boyut * 2, boyut);

  // Parlama efektleri
  ctx.fillStyle = RENKLER.boru_acik;
  ctx.fillRect(px + 4, py + boyut, 4, yukseklik - boyut);
  ctx.fillRect(px + 2, py + 4, 6, boyut - 8);
}

// Bayrak diregi
export function bayrakCiz(ctx, x, y, boyut, toplamYukseklik) {
  const px = Math.floor(x);
  const py = Math.floor(y);

  // Direk
  ctx.fillStyle = RENKLER.bayrak_gri;
  ctx.fillRect(px + boyut / 2 - 1, py, 3, toplamYukseklik);

  // Bayrak
  ctx.fillStyle = RENKLER.bayrak_yesil;
  ctx.fillRect(px + boyut / 2 + 2, py, boyut, boyut / 2 * 1.5);
  ctx.fillStyle = RENKLER.bayrak_acik;
  ctx.fillRect(px + boyut / 2 + 4, py + 2, boyut - 6, boyut / 2 * 1.5 - 4);
}

// Tasli zemin (underground)
export function tasliZeminCiz(ctx, x, y, boyut) {
  const px = Math.floor(x);
  const py = Math.floor(y);

  ctx.fillStyle = RENKLER.tasli_zemin;
  ctx.fillRect(px, py, boyut, boyut);

  // Tas deseni
  ctx.fillStyle = RENKLER.tasli_koyu;
  ctx.fillRect(px, py, boyut / 2 - 1, boyut / 2 - 1);
  ctx.fillRect(px + boyut / 2 + 1, py + boyut / 2 + 1, boyut / 2 - 1, boyut / 2 - 1);
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.fillRect(px + boyut / 2 + 1, py, boyut / 2 - 1, boyut / 2 - 1);
  ctx.fillRect(px, py + boyut / 2 + 1, boyut / 2 - 1, boyut / 2 - 1);
}

// ============================================================
// YARDIMCI: PİKSEL ÇİZ
// (tileX, tileY) konumunda (en x boy) boyutunda renk ile doldur
// p: buyutme carpani (piksel boyutu)
// ============================================================
function _piksel(ctx, tileX, tileY, en, boy, renk, p) {
  ctx.fillStyle = renk;
  ctx.fillRect(tileX * p, tileY * p, en * p, boy * p);
}
