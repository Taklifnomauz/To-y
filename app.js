// Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzK-nhgXY633wPHvSnqe4qd52E85MTFyy6ZdnU5P2kme9gRQ_CmFqTGmuYsjbtZPdjrYA/exec";

// To'y sanasi: 21-noyabr 2026, soat 18:00.
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
      ism: String(formData.get("guest_name") || "").trim(),
      attendance: String(formData.get("attendance") || ""),
      guest_count: Number(formData.get("guest_count") || 1),
      submitted_at: new Date().toISOString(),
      havola: window.location.href
    };

    if (!payload.ism || !payload.attendance) {
      formStatus.textContent = "Iltimos, barcha maydonlarni to‘ldiring.";
      return;
    }

    button.disabled = true;
    button.textContent = "Yuborilmoqda...";
    formStatus.textContent = "Javobingiz yuborilmoqda...";

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });

      formStatus.textContent = "Javobingiz yuborildi. Rahmat!";
      rsvpForm.reset();
    } catch (error) {
      console.error(error);
      formStatus.textContent =
        "Yuborishda xatolik yuz berdi. Qayta urinib ko‘ring.";
    } finally {
      button.disabled = false;
      button.innerHTML = "Javobni yuborish <span>✓</span>";
    }
  });
}
