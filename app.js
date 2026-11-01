
// ========================================
// SUPABASE SOZLAMALARI
// ========================================

const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const supabaseReady =
  SUPABASE_URL.startsWith("https://") &&
  !SUPABASE_URL.includes("YOUR_") &&
  SUPABASE_ANON_KEY.length > 20 &&
  !SUPABASE_ANON_KEY.includes("YOUR_");

const db =
  supabaseReady && window.supabase
    ? window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
      )
    : null;


// ========================================
// HTML ELEMENTLAR
// ========================================

const cover = document.getElementById("cover");
const invitation = document.getElementById("invitation");
const openButton = document.getElementById("openInvite");
const weddingMusic = document.getElementById("weddingMusic");


// ========================================
// DARVOZANI OCHISH
// ========================================

let invitationOpened = false;

if (cover && invitation && openButton) {
  cover.classList.add("closed");

  openButton.addEventListener("click", async () => {
    if (invitationOpened) return;

    invitationOpened = true;
    openButton.disabled = true;

    // Musiqani ishga tushirish
    if (weddingMusic) {
      weddingMusic.volume = 0.35;

      try {
        await weddingMusic.play();
      } catch (error) {
        console.log("Musiqani avtomatik ishga tushirib bo‘lmadi:", error);
      }
    }

    // Darvoza animatsiyasi
    cover.classList.remove("closed");
    cover.classList.add("opening");

    // Animatsiya tugagach taklifnomani ko‘rsatish
    window.setTimeout(() => {
      cover.hidden = true;

      invitation.classList.add("visible");
      invitation.setAttribute("aria-hidden", "false");

      invitation.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 3900);
  });
}


// ========================================
// COUNTDOWN — TO'Y SANASIGACHA
// 18-dekabr 2026, soat 18:00
// ========================================

const weddingDate = new Date(2026, 11, 18, 18, 0, 0);

function updateCountdown() {
  const diff = Math.max(
    0,
    weddingDate.getTime() - Date.now()
  );

  const values = {
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff / 3600000) % 24,
    minutes: Math.floor(diff / 60000) % 60,
    seconds: Math.floor(diff / 1000) % 60
  };

  Object.entries(values).forEach(([id, value]) => {
    const node = document.getElementById(id);

    if (node) {
      node.textContent = String(value).padStart(2, "0");
    }
  });
}

updateCountdown();
window.setInterval(updateCountdown, 1000);


// ========================================
// XARITA MANZILI
// ========================================

// Keyinchalik haqiqiy restoran manzilini qo'yamiz.
const mapLink = document.getElementById("mapLink");

if (mapLink) {
  mapLink.href = "https://yandex.com/maps/";
  mapLink.target = "_blank";
  mapLink.rel = "noopener noreferrer";
}


// ========================================
// RSVP — MEHMON JAVOBI
// ========================================

const rsvpForm = document.getElementById("rsvpForm");
const formStatus = document.getElementById("formStatus");

if (rsvpForm && formStatus) {
  rsvpForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = rsvpForm.querySelector(
      'button[type="submit"]'
    );

    const data = new FormData(rsvpForm);

    const payload = {
      guest_name: String(
        data.get("guest_name") || ""
      ).trim(),

      attendance: String(
        data.get("attendance") || ""
      ),

      guest_count: Number(
        data.get("guest_count") || 1
      ),

      user_agent: navigator.userAgent,

      submitted_at: new Date().toISOString()
    };

    // Ma'lumotlarni tekshirish
    if (!payload.guest_name || !payload.attendance) {
      formStatus.textContent =
        "Iltimos, barcha maydonlarni to‘ldiring.";

      return;
    }

    if (
      !Number.isInteger(payload.guest_count) ||
      payload.guest_count < 1 ||
      payload.guest_count > 20
    ) {
      formStatus.textContent =
        "Mehmonlar soni 1 dan 20 gacha bo‘lishi kerak.";

      return;
    }

    // Supabase sozlanmagan bo'lsa
    if (!db) {
      formStatus.textContent =
        "RSVP bazasi hali sozlanmagan. Supabase URL va kalitini kiriting.";

      return;
    }

    // Yuborish jarayoni
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Yuborilmoqda...";
    }

    formStatus.textContent = "Javobingiz yuborilmoqda...";

    try {
      const { error } = await db
        .from("rsvps")
        .insert([payload]);

      if (error) {
        console.error("Supabase xatosi:", error);

        formStatus.textContent =
          "Yuborilmadi. Birozdan so‘ng qayta urinib ko‘ring.";

        return;
      }

      formStatus.textContent =
        "Rahmat! Javobingiz muvaffaqiyatli qabul qilindi.";

      rsvpForm.reset();

    } catch (error) {
      console.error("Xatolik:", error);

      formStatus.textContent =
        "Internet yoki server bilan bog‘liq xatolik yuz berdi.";

    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Javobni yuborish";
      }
    }
  });
}
