let currentUser = "";
const login = () => {
  const name = document.getElementById("username").value.trim();
  if (!name) return alert("Inserisci un nome utente");
  currentUser = name;
  document.getElementById("loginSection").classList.add("hidden");
  document.getElementById("menuSection").classList.remove("hidden");
  document.getElementById("userDisplay").textContent = name;
  if (name.toLowerCase() === "admin") {
    document.getElementById("adminSection").classList.remove("hidden");
  }
  caricaPdfDaFirebase();
};

const salvaMenu = () => {
  const giorno = document.getElementById("day").value;
  if (!giorno) return alert("Inserisci il giorno del mese");
  const menu = {
    pranzo: {
      primo: document.getElementById("pranzoPrimo").value,
      secondo: document.getElementById("pranzoSecondo").value,
      contorno: document.getElementById("pranzoContorno").value,
    },
    cena: {
      primo: document.getElementById("cenaPrimo").value,
      secondo: document.getElementById("cenaSecondo").value,
      contorno: document.getElementById("cenaContorno").value,
    },
  };
  db.ref("menu/" + giorno + "/" + currentUser).set(menu);
  alert("Menu salvato!");
};

const resetCronologia = () => {
  if (confirm("Sei sicuro di voler eliminare tutta la cronologia?")) {
    db.ref("menu").remove();
    alert("Cronologia eliminata.");
  }
};

const caricaPdf = () => {
  const file = document.getElementById("pdfInput").files[0];
  if (!file || file.type !== "application/pdf") return alert("Carica un PDF valido.");
  const reader = new FileReader();
  reader.onload = () => {
    const base64 = reader.result.split(",")[1];
    db.ref("pdf").set(base64);
    alert("PDF caricato per tutti!");
    document.getElementById("pdfButton").innerText = "Cambia PDF per tutti";
  };
  reader.readAsDataURL(file);
};

const caricaPdfDaFirebase = () => {
  db.ref("pdf").on("value", (snapshot) => {
    const base64 = snapshot.val();
    if (base64) {
      document.getElementById("pdfViewer").src = `data:application/pdf;base64,${base64}`;
      document.getElementById("pdfButton").innerText = "Cambia PDF per tutti";
    }
  });
};

document.getElementById("themeToggle").addEventListener("change", (e) => {
  document.body.classList.toggle("dark", e.target.checked);
});