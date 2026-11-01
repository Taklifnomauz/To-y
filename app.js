// 1) Supabase loyihangizdan URL va anon keyni shu yerga kiriting.
// 2) Supabase SQL Editor'da README.md ichidagi schema.sql ni bajaring.
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
const supabaseReady = SUPABASE_URL.startsWith("https://") && !SUPABASE_URL.includes("YOUR_") && !SUPABASE_ANON_KEY.includes("YOUR_");
const db = supabaseReady ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const cover = document.getElementById("cover");
const invitation = document.getElementById("invitation");
const music = document.getElementById("weddingMusic");
const musicToggle = document.getElementById("musicToggle");
let musicPlaying = false;

document.getElementById("openInvite").addEventListener("click", async () => {
  cover.classList.add("opening");
  setTimeout(() => { cover.classList.add("hidden"); invitation.classList.remove("hidden"); }, 1850);
  window.scrollTo({top:0,behavior:"smooth"});
  try { await music.play(); musicPlaying = true; musicToggle.innerHTML = "♫ <span>Musiqa yoqilgan</span>"; }
  catch { musicToggle.innerHTML = "♫ <span>Musiqani yoqish</span>"; }
});
musicToggle.addEventListener("click", async () => {
  if (musicPlaying) { music.pause(); musicPlaying=false; musicToggle.innerHTML="♫ <span>Musiqani yoqish</span>"; }
  else { try { await music.play(); musicPlaying=true; musicToggle.innerHTML="♫ <span>Musiqa yoqilgan</span>"; } catch {} }
});

// To'y sanasi va vaqtini shu qatorda o'zgartiring. Format: YYYY-MM-DDTHH:mm:ss+05:00
const weddingDate = new Date("2026-12-18T18:00:00+05:00");
function updateCountdown(){
  const left = Math.max(0, weddingDate.getTime()-Date.now());
  const d=Math.floor(left/86400000), h=Math.floor(left/3600000)%24, m=Math.floor(left/60000)%60, s=Math.floor(left/1000)%60;
  document.getElementById("days").textContent=d;
  document.getElementById("hours").textContent=String(h).padStart(2,"0");
  document.getElementById("minutes").textContent=String(m).padStart(2,"0");
  document.getElementById("seconds").textContent=String(s).padStart(2,"0");
}
updateCountdown(); setInterval(updateCountdown,1000);

// Yandex Maps manzilini o'zingizning to'yxona manzilingizga almashtiring.
document.getElementById("mapLink").href="https://yandex.com/maps/?text="+encodeURIComponent("Marvarid to‘yxonasi, Toshkent");

document.getElementById("rsvpForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const message = document.getElementById("formMessage");
  const record = {
    guest_name: String(form.get("name")).trim(),
    attendance: String(form.get("attendance")),
    guest_count: Number(form.get("guests")),
    user_agent: navigator.userAgent,
    submitted_at: new Date().toISOString()
  };
  if (!record.guest_name) { message.textContent="Iltimos, ism-familiyangizni yozing."; return; }
  if (!db) { message.textContent="Demo rejim: javob saqlanmadi. README'dagi Supabase sozlamasini bajaring."; return; }
  message.textContent="Yuborilmoqda…";
  const {error}=await db.from("rsvps").insert(record);
  message.textContent=error ? "Yuborilmadi. Keyinroq yana urinib ko‘ring." : "Rahmat! Javobingiz qabul qilindi.";
  if(!error) event.currentTarget.reset();
});
