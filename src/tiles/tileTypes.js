// ============================================================
// TİLE TİPLERİ VE ÖZELLİKLERİ
// Her tile tipinin ID, isim, fizik ve icerigi tanimlidir.
// ============================================================

// Tile tip kimlikleri (level verisinde bu sayilar kullanilir)
export const TILE_TIP = {
  BOS:          0,  // Bos alan - gecilebilir
  ZEMIN:        1,  // Zemin/toprak blogu - kati
  TUGLA:        2,  // Tugla blogu - kati, buyuk Mario kirar
  SORU_BLOK:    3,  // Soru blogu (?) - kati, icinde nesne var
  SERT_BLOK:    4,  // Kirilmaz sert blok - kati
  BORU_SOL_UST: 5,  // Boru sol ust - kati
  BORU_SAG_UST: 6,  // Boru sag ust - kati
  BORU_SOL:     7,  // Boru sol govde - kati
  BORU_SAG:     8,  // Boru sag govde - kati
  BAYRAK_DIREK: 9,  // Level sonu bayrak diregi - kati degil
  KULLANILMIS: 10,  // Kullanilmis soru blogu - kati
  COIN_TILE:   11,  // Harita uzerindeki coin - kati degil
};

// Tile ozellik tanimlari: { kati, kiriliyor, blogunIcerigi }
export const TILE_OZELLIK = {
  [TILE_TIP.BOS]:          { kati: false, kiriliyor: false, icerik: null },
  [TILE_TIP.ZEMIN]:        { kati: true,  kiriliyor: false, icerik: null },
  [TILE_TIP.TUGLA]:        { kati: true,  kiriliyor: true,  icerik: null },
  [TILE_TIP.SORU_BLOK]:    { kati: true,  kiriliyor: false, icerik: 'coin' }, // Varsayilan: coin
  [TILE_TIP.SERT_BLOK]:    { kati: true,  kiriliyor: false, icerik: null },
  [TILE_TIP.BORU_SOL_UST]: { kati: true,  kiriliyor: false, icerik: null },
  [TILE_TIP.BORU_SAG_UST]: { kati: true,  kiriliyor: false, icerik: null },
  [TILE_TIP.BORU_SOL]:     { kati: true,  kiriliyor: false, icerik: null },
  [TILE_TIP.BORU_SAG]:     { kati: true,  kiriliyor: false, icerik: null },
  [TILE_TIP.BAYRAK_DIREK]: { kati: false, kiriliyor: false, icerik: null },
  [TILE_TIP.KULLANILMIS]:  { kati: true,  kiriliyor: false, icerik: null },
  [TILE_TIP.COIN_TILE]:    { kati: false, kiriliyor: false, icerik: null },
};
