// ============================================================
// OYUN KONFIGURASYON DOSYASI
// Tum sabit degerler burada tanimlidir.
// Degerleri buradan degistirerek oyunu ayarlayabilirsiniz.
// ============================================================

export const KONFIG = {
  // --- CANVAS AYARLARI ---
  CANVAS_EN: 512,       // Canvas genisligi (piksel)
  CANVAS_BOY: 448,      // Canvas yuksekligi (piksel)

  // --- TILE AYARLARI ---
  TILE_BOYUT: 32,       // Her tile'in boyutu (piksel)

  // --- FİZİK AYARLARI ---
  YERCEKIMI: 1800,      // Piksel/saniye^2 yer cekimi kuvveti
  MAKSIMUM_DUSME: 700,  // Maksimum dusus hizi (piksel/saniye)

  // --- MARIO AYARLARI ---
  MARIO_HIZ: 220,         // Yatay hareket hizi (piksel/saniye)
  MARIO_KOSMA_HIZ: 320,   // Kosma hizi (B tusu ile)
  MARIO_ZIPLAMA: -520,    // Ziplama baslangic hizi (piksel/saniye, negatif = yukari)
  MARIO_BUYUK_ZIPLAMA: -560,  // Buyuk Mario'nun ziplama hizi
  MARIO_CAN: 3,           // Baslangic can sayisi

  // --- KAMERA AYARLARI ---
  KAMERA_TETIK_X: 200,  // Mario bu X'e gelince kamera kaymaya baslar

  // --- OYUN AYARLARI ---
  SURE_SINIRI: 400,     // Her levelin sure siniri (saniye)
  SKOR_COIN: 200,       // Coin toplama puani
  SKOR_DUSMANTEPE: 100, // Dusmana basma puani
  SKOR_LEVEL: 1000,     // Level tamamlama puani

  // --- ANİMASYON AYARLARI ---
  YURUYEN_ANIMASYON_FPS: 8, // Yuruyen animasyonun kare hizi
  KARE_SURESI: 1 / 60,      // Hedef kare suresi (60 FPS)
};
