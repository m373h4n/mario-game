# Super Mario - Tarayici Oyunu

Saf HTML5 Canvas ve Vanilla JavaScript ile yazilmis klasik Mario platform oyunu.
Hicbir harici kutuphane, gorsel dosya veya sunucu gerektirmez.
Tum grafikler Canvas 2D API ile kod olarak piksel sanati olarak cizilmistir.

---

## Oynamak

### Yontem 1: Yerel HTTP Sunucusu (Tavsiye Edilir)
```bash
# Python ile
python3 -m http.server 8000
# Sonra tarayicida: http://localhost:8000

# Node.js ile
npx serve .
```

### Yontem 2: GitHub Pages
Repo'yu fork et, Settings > Pages > Branch: main > Save

---

## Kontroller

### Masaustu (Klavye)

| Tus | Eylem |
|-----|-------|
| `←` / `A` | Sola git |
| `→` / `D` | Saga git |
| `↑` / `Space` / `Z` | Zipla |
| `Shift` | Kos (sprint) |
| `P` / `ESC` | Duraklatma (yakinda) |

**Not:** Ziplama tusu ne kadar uzun tutulursa, Mario o kadar yuksek ziplayabilir!

### Mobil (Dokunmatik)
Ekranin alt kosesindeki butonlari kullan:
- **◀ ▶** Sol/Sag hareket
- **A** Zipla
- **B** Kos

---

## Oyun Ozellikleri

- **2 Level:** Dunya 1-1 (dis mekan) + Dunya 1-2 (yeralti)
- **Karakterler:** Kucuk Mario, Buyuk Mario (mantar sonrasi)
- **Dusmanlar:** Goomba (baste oz) + Koopa Troopa (kabuk mekanigi)
- **Toplabilirler:** Coin, kirmizi guc mantari
- **Blok sistemi:** Soru bloklari, tugla kirma (buyuk Mario ile)
- **Fizik:** Yerçekimi, coyote time, jump buffer, degisken ziplama
- **Ses:** Web Audio API ile prosedural efektler (harici dosya yok)
- **HUD:** Skor, can, coin sayisi, level adi, kalan sure
- **Kamera:** Yumusak side-scrolling (lerp)
- **Responsive:** Tum ekran boyutlarina uyar

---

## Teknik Detaylar

| Ozellik | Deger |
|---------|-------|
| Dil | Saf JavaScript (ES Modules) |
| Render | HTML5 Canvas 2D Context |
| Ses | Web Audio API (prosedural) |
| Fizik | AABB carpisma sistemi |
| Canvas Cozunurluk | 512 x 448 piksel |
| Hedef FPS | 60 |
| Minifiye | Hayir (okunabilir kod) |

---

## Dosya Yapisi

```
mario-game/
├── index.html              # Ana giris noktasi
├── README.md               # Bu dosya
└── src/
    ├── main.js             # Oyun dongusu + durum yoneticisi
    ├── config.js           # Tum sabit degerler
    ├── input.js            # Klavye/dokunma girisi
    ├── physics.js          # AABB carpisma motoru
    ├── camera.js           # Side-scrolling kamera
    ├── entities/
    │   ├── Entity.js       # Temel varlik sinifi
    │   ├── Mario.js        # Oyuncu karakteri
    │   ├── Goomba.js       # Goomba dusmani
    │   ├── Koopa.js        # Koopa dusmani
    │   ├── Coin.js         # Coin toplanabilir
    │   └── Mushroom.js     # Mantar power-up
    ├── tiles/
    │   ├── tileTypes.js    # Tile tip tanimlari
    │   ├── Tile.js         # Tile sinifi
    │   └── TileMap.js      # Harita yoneticisi
    ├── levels/
    │   ├── Level.js        # Level yoneticisi
    │   ├── level1.js       # Dunya 1-1 verisi
    │   └── level2.js       # Dunya 1-2 verisi
    ├── sprites/
    │   └── spriteRenderer.js  # Canvas piksel art cizimi
    ├── audio/
    │   └── audioManager.js    # Web Audio ses efektleri
    └── ui/
        └── hud.js          # HUD + menu ekranlari
```

---

## Mimari

```
Oyun (main.js)
 ├── GirisYoneticisi      → Klavye/dokunma
 ├── Kamera               → Side-scrolling
 ├── SesYoneticisi        → Web Audio API
 ├── HUD                  → Ekran bilgileri
 └── Level
      ├── TileMap         → Tile haritasi
      └── Entity[]
           ├── Mario      → Oyuncu
           ├── Goomba[]   → Dusmanlar
           ├── Koopa[]    → Dusmanlar
           ├── Coin[]     → Toplanabilirler
           └── Mantar[]   → Power-up
```

---

## Lisans

Egitim ve kisisel kullanim amacli acik kaynak proje.  
Super Mario karakterleri ve oyun tasarimi Nintendo'ya aittir.  
Bu proje, Nintendo ile hicbir sekilde iliskili degildir.
