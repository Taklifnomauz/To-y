# Silk Romance — elektron taklifnoma starter

Mobilga mos, nafis taklifnoma sahifasi. GitHub Pages orqali chiqarish uchun tayyorlangan boshlang‘ich loyiha.

## 1. O‘zingizga moslang
- `index.html`: kelin-kuyov ismi, sana, matn va to‘yxona nomini almashtiring.
- `app.js`: `weddingDate` va Yandex Maps manzilini yangilang.
- O‘zingiz foydalanishga ruxsatli MP3 faylni `assets/music.mp3` nomida joylang.
- `style.css`: ranglar, bezak va tipografiyani sozlang.

## 2. GitHub Pages
1. GitHub’da yangi repository yarating.
2. Shu papkadagi fayllarni repository root’iga yuklang.
3. Repository → Settings → Pages → Deploy from a branch → `main` / `root`.
4. Sayt GitHub Pages manzilida chiqadi.

## 3. Mehmon javoblarini saqlash (Supabase)
GitHub Pages statik hosting. RSVP ma’lumotlarini saqlash uchun Supabase kerak.

1. Supabase’da loyiha yarating.
2. SQL Editor’da `schema.sql` faylini bajaring.
3. Project URL va anon/public key’ni `app.js` ichiga kiriting.
4. RLS siyosati hozircha mehmonlarga faqat javob yuborishni ruxsat qiladi; o‘qish faqat autentifikatsiyalangan admin uchun.

**Maxfiylik eslatmasi:** RSVP yuborishda brauzer turi (`user_agent`) saqlanadi. IP manzilni bu starter yig‘maydi. Aniq shaxsni qurilma ma’lumotidan kafolatli aniqlab bo‘lmaydi. Mehmonlarga ma’lumot yig‘ilishi haqida xabar bering.

## 4. Admin panel
Bu starterda admin panel hali qo‘shilmagan — keyingi bosqichda Supabase Auth bilan parol orqali himoyalangan `/admin` sahifasini yaratamiz. Admin parolini hech qachon HTML yoki JavaScript ichiga yozmang.

## Eslatma
Hozirgi ismlar, sana, manzil va matnlar demo qiymatlar. Ularni haqiqiy ma’lumotlaringizga almashtiring.
