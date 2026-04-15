// ============================================================
// HUD - OYUN İÇİ BİLGİ GÖSTERGESİ
// Skor, can, coin sayisi, level adi ve kalan sureyi gosterir.
// Canvas'in en ustune kamera bagimsiz olarak cizilir.
// ============================================================

export class HUD {
  constructor() {
    this.font = '16px monospace';
    this.fontBuyuk = 'bold 20px monospace';
    this.renk = '#FFFFFF';
    this.golgeRenk = '#000000';
  }

  // HUD'u ciz
  ciz(ctx, mario, sure, levelIsim) {
    const y = 20; // Ust bosluk

    // Arkaplan seridi (hafif saydam siyah)
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(0, 0, ctx.canvas.width, 36);

    // --- SOL: MARIO SKORU ---
    this._baslik(ctx, 'MARIO', 10, y);
    this._deger(ctx, String(mario.skor).padStart(6, '0'), 10, y + 18);

    // --- ORTA-SOL: COIN SAYISI ---
    this._coinIkonu(ctx, 140, y + 2);
    this._deger(ctx, `x${String(mario.coinler).padStart(2, '0')}`, 162, y + 18);

    // --- ORTA: LEVEL ADI ---
    const ortaX = ctx.canvas.width / 2 - 30;
    this._baslik(ctx, 'DÜNYA', ortaX, y);
    this._deger(ctx, levelIsim, ortaX, y + 18);

    // --- ORTA-SAG: CAN ---
    const canX = ctx.canvas.width / 2 + 70;
    this._marioIkonu(ctx, canX, y - 2);
    this._deger(ctx, `x${mario.canlar}`, canX + 22, y + 18);

    // --- SAG: KALAN SÜRE ---
    const sureX = ctx.canvas.width - 80;
    this._baslik(ctx, 'SÜRE', sureX, y);
    const sureRenk = sure <= 100 ? '#FF4444' : '#FFFFFF'; // Az kalinca kirmizi
    this._degerRenkli(ctx, String(Math.max(0, Math.floor(sure))).padStart(3, '0'), sureX, y + 18, sureRenk);
  }

  // Kucuk baslik metni
  _baslik(ctx, metin, x, y) {
    ctx.font = '11px monospace';
    ctx.fillStyle = '#CCCCCC';
    ctx.fillText(metin, x, y);
  }

  // Deger metni (skor, coin vs.)
  _deger(ctx, metin, x, y) {
    ctx.font = this.fontBuyuk;
    // Gölge
    ctx.fillStyle = this.golgeRenk;
    ctx.fillText(metin, x + 1, y + 1);
    // Ana metin
    ctx.fillStyle = this.renk;
    ctx.fillText(metin, x, y);
  }

  // Renkli deger metni
  _degerRenkli(ctx, metin, x, y, renk) {
    ctx.font = this.fontBuyuk;
    ctx.fillStyle = '#000';
    ctx.fillText(metin, x + 1, y + 1);
    ctx.fillStyle = renk;
    ctx.fillText(metin, x, y);
  }

  // Kucuk coin ikonu
  _coinIkonu(ctx, x, y) {
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(x + 7, y + 8, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFF176';
    ctx.beginPath();
    ctx.arc(x + 5, y + 6, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Kucuk Mario ikonu
  _marioIkonu(ctx, x, y) {
    // Sapka
    ctx.fillStyle = '#E52521';
    ctx.fillRect(x + 4, y, 12, 6);
    // Yuz
    ctx.fillStyle = '#FDA050';
    ctx.fillRect(x + 2, y + 6, 16, 8);
    // Govde
    ctx.fillStyle = '#3A6BC9';
    ctx.fillRect(x + 2, y + 14, 16, 6);
  }

  // Mesaj goster (level tamamlama, game over vs.)
  mesajGoster(ctx, satir1, satir2, altMetin) {
    const cx = ctx.canvas.width / 2;
    const cy = ctx.canvas.height / 2;

    // Saydam arkaplan
    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    ctx.fillRect(cx - 140, cy - 60, 280, 140);

    // Ana mesaj
    ctx.font = 'bold 28px monospace';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.fillText(satir1, cx + 2, cy - 10 + 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(satir1, cx, cy - 10);

    if (satir2) {
      ctx.font = 'bold 20px monospace';
      ctx.fillStyle = '#000';
      ctx.fillText(satir2, cx + 1, cy + 22 + 1);
      ctx.fillStyle = '#FFD700';
      ctx.fillText(satir2, cx, cy + 22);
    }

    if (altMetin) {
      ctx.font = '14px monospace';
      ctx.fillStyle = '#CCCCCC';
      ctx.fillText(altMetin, cx, cy + 55);
    }

    ctx.textAlign = 'left';
  }

  // Basla ekrani
  baslaEkrani(ctx) {
    const cx = ctx.canvas.width / 2;
    const cy = ctx.canvas.height / 2;

    // Arka plan
    ctx.fillStyle = '#5C94FC';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Gokyuzu bulutlari (dekor)
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    _bulutCizBasit(ctx, 60, 60);
    _bulutCizBasit(ctx, 300, 40);
    _bulutCizBasit(ctx, 420, 80);

    // Baslik golge
    ctx.font = 'bold 52px monospace';
    ctx.fillStyle = '#7B1A18';
    ctx.textAlign = 'center';
    ctx.fillText('SUPER MARIO', cx + 3, cy - 60 + 3);
    // Baslik
    ctx.fillStyle = '#E52521';
    ctx.fillText('SUPER MARIO', cx, cy - 60);

    // Alt baslik
    ctx.font = 'bold 24px monospace';
    ctx.fillStyle = '#000';
    ctx.fillText('Tarayici Oyunu', cx + 1, cy - 20 + 1);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('Tarayici Oyunu', cx, cy - 20);

    // Baslangic butonu
    const tusZaman = Math.floor(Date.now() / 600) % 2 === 0;
    ctx.font = 'bold 18px monospace';
    ctx.fillStyle = tusZaman ? '#FFD700' : '#FFFFFF';
    ctx.fillText('BAŞLAMAK İÇİN ENTER VEYA TIKLA', cx, cy + 40);

    // Kontroller
    ctx.font = '14px monospace';
    ctx.fillStyle = '#CCCCCC';
    ctx.fillText('← → Hareket  |  Z/Space Zipla  |  Shift Kos', cx, cy + 80);
    ctx.fillText('Mobil: Ekrandaki butonları kullan', cx, cy + 100);

    ctx.textAlign = 'left';
  }
}

// Basit bulut cizici (basla ekrani icin)
function _bulutCizBasit(ctx, x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.arc(x + 25, y - 10, 25, 0, Math.PI * 2);
  ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
  ctx.fill();
}
