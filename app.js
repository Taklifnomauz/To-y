// Supabase sozlamalarini o'zingizning loyihangiz bilan to'ldiring.
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
const supabaseReady = SUPABASE_URL.startsWith("https://") && !SUPABASE_URL.includes("YOUR_") && !SUPABASE_ANON_KEY.includes("YOUR_");
const db = supabaseReady && window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const cover = document.getElementById("cover");
const invitation = document.getElementById("invitation");
document.getElementById("openInvite").addEventListener("click", () => {
  cover.classList.add("opening");
  window.setTimeout(() => {
    cover.hidden = true;
    invitation.classList.add("visible");
    invitation.setAttribute("aria-hidden", "false");
    invitation.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 1900);
});

// To'y sanasi: 18-dekabr 2026, soat 18:00 (mahalliy vaqt).
const weddingDate = new Date(2026, 11, 18, 18, 0, 0);
function updateCountdown() {
  const diff = Math.max(0, weddingDate.getTime() - Date.now());
  const values = {
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff / 3600000) % 24,
    minutes: Math.floor(diff / 60000) % 60,
    seconds: Math.floor(diff / 1000) % 60
  };
  Object.entries(values).forEach(([id, value]) => {
    const node = document.getElementById(id);
    if (node) node.textContent = String(value).padStart(2, "0");
  });
}
updateCountdown();
window.setInterval(updateCountdown, 1000);

// Keyin haqiqiy xarita manzilini shu URLga qo'ying.
document.getElementById("mapLink").href = "https://yandex.com/maps/";

document.getElementById("rsvpForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.getElementById("formStatus");
  const data = new FormData(form);
  const payload = {
    guest_name: String(data.get("guest_name") || "").trim(),
    attendance: String(data.get("attendance") || ""),
    guest_count: Number(data.get("guest_count") || 1),
    user_agent: navigator.userAgent,
    submitted_at: new Date().toISOString()
  };
  if (!payload.guest_name || !payload.attendance) {
    status.textContent = "Iltimos, barcha maydonlarni to'ldiring.";
    return;
  }
  if (!db) {
    status.textContent = "RSVP bazasi hali sozlanmagan. Supabase URL va kalitini app.js faylida kiriting.";
    return;
  }
  status.textContent = "Yuborilmoqda…";
  const { error } = await db.from("rsvps").insert(payload);
  if (error) {
    status.textContent = "Yuborilmadi. Birozdan so'ng qayta urinib ko'ring.";
    console.error(error);
    return;
  }
  status.textContent = "Rahmat! Javobingiz qabul qilindi.";
  form.reset();
});
