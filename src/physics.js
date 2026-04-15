// ============================================================
// FİZİK MOTORU - AABB ÇARPIŞMA ALGILAMA VE ÇÖZÜMLEME
// Axis-Aligned Bounding Box (Eksene Hizali Sinir Kutusu)
// yontemini kullanarak carpismalari tespit eder ve cozer.
// ============================================================

import { KONFIG } from './config.js';

// Iki dikdortgenin carpisiyor mu kontrol eder (AABB)
export function carpisiyor(a, b) {
  return (
    a.x < b.x + b.genislik &&
    a.x + a.genislik > b.x &&
    a.y < b.y + b.yukseklik &&
    a.y + a.yukseklik > b.y
  );
}

// Carpisan tarafin yonunu belirler
// Dondurulen deger: 'ust' | 'alt' | 'sol' | 'sag' | null
export function carpismaTarafi(hareket, sabit) {
  if (!carpisiyor(hareket, sabit)) return null;

  // Ortalar arasi fark
  const hMerkezX = hareket.x + hareket.genislik / 2;
  const hMerkezY = hareket.y + hareket.yukseklik / 2;
  const sMerkezX = sabit.x + sabit.genislik / 2;
  const sMerkezY = sabit.y + sabit.yukseklik / 2;

  const farkX = hMerkezX - sMerkezX;
  const farkY = hMerkezY - sMerkezY;

  // Her eksende ortusme miktari
  const ortusmeX = (hareket.genislik + sabit.genislik) / 2 - Math.abs(farkX);
  const ortusmeY = (hareket.yukseklik + sabit.yukseklik) / 2 - Math.abs(farkY);

  // Daha az ortusme olan eksenden gelen carpismadir
  if (ortusmeX < ortusmeY) {
    return farkX > 0 ? 'sag' : 'sol';
  } else {
    return farkY > 0 ? 'alt' : 'ust';
  }
}

// Varligi tile haritasiyla carpistirir ve pozisyonu duzeltir
// Once yatay, sonra dikey - bu sira koseler icin kritik!
export function tileCarpismaCozu(entity, tileMap) {
  const sonuc = {
    yerde: false,        // Alta carpisma oldu mu?
    tavana: false,       // Uste carpisma oldu mu?
    duvara: false,       // Yana carpisma oldu mu?
    carpistigi: null,    // Carpisan tile
  };

  // --- YATAY CARPISMA ---
  const yaklasikX = {
    x: entity.x,
    y: entity.y + 2,                    // Hafif ic bosluk - kenar takılmasini onler
    genislik: entity.genislik,
    yukseklik: entity.yukseklik - 4,    // Alt/ust kenarlarda bosluk
  };

  const yatayTileler = _cevredekiTileler(yaklasikX, tileMap);
  for (const tile of yatayTileler) {
    if (!tile.kati) continue;
    const yon = carpismaTarafi(yaklasikX, tile);
    if (yon === 'sol') {
      entity.x = tile.x + tile.genislik;
      entity.hizX = 0;
      sonuc.duvara = true;
    } else if (yon === 'sag') {
      entity.x = tile.x - entity.genislik;
      entity.hizX = 0;
      sonuc.duvara = true;
    }
  }

  // --- DİKEY CARPISMA ---
  const yaklasikY = {
    x: entity.x + 2,
    y: entity.y,
    genislik: entity.genislik - 4,
    yukseklik: entity.yukseklik,
  };

  const dikeyTileler = _cevredekiTileler(yaklasikY, tileMap);
  for (const tile of dikeyTileler) {
    if (!tile.kati) continue;
    const yon = carpismaTarafi(yaklasikY, tile);
    if (yon === 'alt') {
      // Asagidan carpisma - zemin
      entity.y = tile.y - entity.yukseklik;
      entity.hizY = 0;
      entity.yerde = true;
      sonuc.yerde = true;
      sonuc.carpistigi = tile;
    } else if (yon === 'ust') {
      // Yukaridan carpisma - tavan / blok
      entity.y = tile.y + tile.yukseklik;
      entity.hizY = 0;
      sonuc.tavana = true;
      sonuc.carpistigi = tile;
    }
  }

  return sonuc;
}

// Verilen konuma en yakin tile'lari dondurur (3x3 alan)
function _cevredekiTileler(kutu, tileMap) {
  const tileBoyut = KONFIG.TILE_BOYUT;
  const tileler = [];

  // Kutunun kapladigi tile araligini hesapla
  const solTile  = Math.floor(kutu.x / tileBoyut) - 1;
  const sagTile  = Math.ceil((kutu.x + kutu.genislik) / tileBoyut) + 1;
  const ustTile  = Math.floor(kutu.y / tileBoyut) - 1;
  const altTile  = Math.ceil((kutu.y + kutu.yukseklik) / tileBoyut) + 1;

  for (let satir = ustTile; satir <= altTile; satir++) {
    for (let sutun = solTile; sutun <= sagTile; sutun++) {
      const tile = tileMap.getTile(sutun, satir);
      if (tile) tileler.push(tile);
    }
  }

  return tileler;
}

// Dunya sinirlari disina cikmasi durumunda duzeltme
export function dunyaSinirKontrol(entity, dunyaGenislik) {
  if (entity.x < 0) {
    entity.x = 0;
    entity.hizX = 0;
  }
  if (entity.x + entity.genislik > dunyaGenislik) {
    entity.x = dunyaGenislik - entity.genislik;
    entity.hizX = 0;
  }
}
