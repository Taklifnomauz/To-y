// Supabase sozlamalari — o'z loyihangiz ma'lumotlarini kiriting.
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const supabaseReady =
  SUPABASE_URL.startsWith("https://") &&
  !SUPABASE_URL.includes("YOUR_") &&
  SUPABASE_ANON_KEY.length > 20 &&
  !SUPABASE_ANON_KEY.includes("YOUR_");

const db =
  supabaseReady && window.supabase
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

// To'y sanasi: 18-dekabr 2026, soat 18:00.
const weddingDate = new Date(2026, 10, 21, 18, 0, 0);

function updateCountdown() {
  const diff = Math.max(0, weddingDate.getTime() - Date.now());

  const values = {
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff / 3600000) % 24,
    minutes: Math.floor(diff / 60000) % 60,
    seconds: Math.floor(diff / 1000) % 60
  };

  Object.entries(values).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = String(value).padStart(2, "0");
  });
}

updateCountdown();
window.setInterval(updateCountdown, 1000);

// RSVP yuborish
const rsvpForm = document.getElementById("rsvpForm");
const formStatus = document.getElementById("formStatus");

if (rsvpForm && formStatus) {
  rsvpForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const button = rsvpForm.querySelector('button[type="submit"]');
    const formData = new FormData(rsvpForm);

    const payload = {
      guest_name: String(formData.get("guest_name") || "").trim(),
      attendance: String(formData.get("attendance") || ""),
      guest_count: Number(formData.get("guest_count") || 1),
      user_agent: navigator.userAgent,
      submitted_at: new Date().toISOString()
    };

    if (!payload.guest_name || !payload.attendance) {
      formStatus.textContent = "Iltimos, barcha maydonlarni to‘ldiring.";
      return;
    }

    if (!db) {
      formStatus.textContent =
        "RSVP bazasi sozlanmagan. Supabase URL va kalitini kiriting.";
      return;
    }

    button.disabled = true;
    button.textContent = "Yuborilmoqda...";
    formStatus.textContent = "Javobingiz yuborilmoqda...";

    try {
      const { error } = await db.from("rsvps").insert([payload]);

      if (error) {
        console.error(error);
        formStatus.textContent =
          "Yuborilmadi. Birozdan so‘ng qayta urinib ko‘ring.";
        return;
      }

      formStatus.textContent = "Rahmat! Javobingiz qabul qilindi.";
      rsvpForm.reset();
    } catch (error) {
      console.error(error);
      formStatus.textContent = "Ulanishda xatolik yuz berdi.";
    } finally {
      button.disabled = false;
      button.innerHTML = "Javobni yuborish <span>✓</span>";
    }
  });
}
