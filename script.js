// WYSZUKIWANIE PRODUKTÓW
document.addEventListener("DOMContentLoaded", function () {

  const input = document.getElementById("wyszukiwanieinput");
  const produkts = document.querySelectorAll(".produkt");

  if (!input) return;

  input.addEventListener("input", function () {
    const value = input.value.toLowerCase().trim();

    produkts.forEach(produkt => {
      const text = produkt.innerText.toLowerCase();
      produkt.style.display = text.includes(value) ? "flex" : "none";
    });
  });

});


// FAKE SEARCH
document.addEventListener("DOMContentLoaded", function () {

  const fake = document.getElementById("falszywewyszukiwanie");
  const real = document.getElementById("prawdziwewyszukiwanie");
  const input = document.getElementById("wyszukiwanieinput");

  if (!fake || !real || !input) return;

  fake.addEventListener("click", function () {
    fake.classList.add("hidden");
    real.classList.remove("hidden");

    setTimeout(() => input.focus(), 100);
  });

});



// ANIMACJA TEKSTU
document.addEventListener("DOMContentLoaded", function () {

  const phrases = [
    "Real Madryt",
    "Barcelona",
    "Chelsea FC",
    "Liverpool",
    "AC Milan",
    "Bayern Monachium",
    "Manchester United"
  ];

  const typingText = document.getElementById("wpisywanie-tekstu");
  if (!typingText) return;

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeEffect() {
    const current = phrases[phraseIndex];

    if (!deleting) {
      typingText.textContent = current.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeEffect, 1000);
        return;
      }
    } else {
      typingText.textContent = current.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    setTimeout(typeEffect, deleting ? 50 : 100);
  }

  typeEffect();
});



// ZMIANA KOSZULEK
function zmianaKoszulki(select) {

  const produkt = select.closest(".produkt");
  if (!produkt) return;

  const typ = select.value;
  const druzyna = produkt.dataset.druzyna;

  const przod = produkt.querySelector(".przod");
  const tyl = produkt.querySelector(".tyl");

  if (!przod || !tyl) return;

  przod.src = `${druzyna}-${typ}-przod.webp`;
  tyl.src = `${druzyna}-${typ}-tyl.webp`;
}


// DODAWANIE DO KOSZYKA
function dodawanieDoKoszyka(button, name, price) {

  const produktDiv = button.closest(".produkt");
  if (!produktDiv) return;

  const rozmiarSelect = produktDiv.querySelector(".rozmiar");
  if (!rozmiarSelect) return;

  const rozmiar = rozmiarSelect.value;

  if (!rozmiar) {
    alert("Wybierz rozmiar!");
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.push({
    name,
    price,
    rozmiar
  });

  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Dodano do koszyka");

  // tylko odśwież koszyk jeśli jesteś na stronie koszyka
  pokazPodsumowanie();
}


// PODSUMOWANIE KOSZYKA
function pokazPodsumowanie() {

  const podsumowanieDiv = document.getElementById("podsumowanie");
  const dostawaSelect = document.getElementById("dostawa");

  if (!podsumowanieDiv) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  podsumowanieDiv.innerHTML = "";

  if (cart.length === 0) {
    podsumowanieDiv.innerHTML = "<p>Koszyk jest pusty</p>";
    return;
  }

  let total = 0;

  const title = document.createElement("h3");
  title.textContent = "Produkty:";
  podsumowanieDiv.appendChild(title);

  cart.forEach(item => {
    const p = document.createElement("p");
    p.textContent = `${item.name} (Rozmiar ${item.rozmiar}) - ${item.price} zł`;
    podsumowanieDiv.appendChild(p);
    total += item.price;
  });

// dostawa
  let deliveryCost = 0;

  if (dostawaSelect) {
    switch (dostawaSelect.value) {
      case "Kurier InPost": deliveryCost = 9; break;
      case "Paczkomat InPost": deliveryCost = 7; break;
      case "Kurier DPD": deliveryCost = 11; break;
      case "Punkt ORLEN Paczka": deliveryCost = 8; break;
      case "Kurier DHL": deliveryCost = 12; break;
    }
  }

  const final = total + deliveryCost;

  const finalSum = document.createElement("h3");
  finalSum.textContent = `Łącznie: ${final.toFixed(2)} zł`;

  podsumowanieDiv.appendChild(finalSum);
}


// ZŁOŻENIE ZAMÓWIENIA
function zlozZamowienie() {

  const imie = document.getElementById("imie").value;
  const adres = document.getElementById("adres").value;
  const email = document.getElementById("email").value;
  const dostawa = document.getElementById("dostawa").value;
  const platnosc = document.getElementById("platnosc").value;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Koszyk jest pusty!");
    return;
  }

  if (!imie || !adres || !email || !dostawa || !platnosc) {
    alert("Wypełnij wszystkie dane!");
    return;
  }

  const pickup = document.getElementById("punktOdbioruu")?.value;

  if (
    (dostawa === "Paczkomat InPost" || dostawa === "Punkt ORLEN Paczka") &&
    !pickup
  ) {
    alert("Podaj punkt odbioru!");
    return;
  }

  const sum = cart.reduce((a, b) => a + b.price, 0);

  alert(
    `Zamówienie złożone!\n\n` +
    `Imię: ${imie}\n` +
    `Adres: ${adres}\n` +
    `Email: ${email}\n` +
    `Dostawa: ${dostawa}\n` +
    `Płatność: ${platnosc}\n` +
    `Suma: ${sum} zł`
  );

  localStorage.removeItem("cart");
  location.reload();
}


// POKAZ / UKRYJ PACZKOMAT
function punktOdbioru() {

  const dostawa = document.getElementById("dostawa");
  const box = document.getElementById("adresPunktu");

  if (!dostawa || !box) return;

  box.style.display =
    (dostawa.value === "Paczkomat InPost" ||
     dostawa.value === "Punkt ORLEN Paczka")
      ? "block" : "none";
}


// CZYSZCZENIE KOSZYKA
function wyczyscKoszyk() {
  localStorage.removeItem("cart");
  location.reload();
}


// POKAZANIE PODSUMOWANIA
document.addEventListener("DOMContentLoaded", function () {
  pokazPodsumowanie();
});