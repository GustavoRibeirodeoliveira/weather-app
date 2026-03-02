const API_KEY = "2564e13205f9d14c9e12233b5e83b823";

let lastCityData = null;


 

async function getWeather() {

  const city = document.getElementById("cityInput").value.trim();
  const resultDiv = document.getElementById("weatherResult");
  const favBtn = document.getElementById("addFavoriteBtn");

  if (city === "") {
    alert("Digite uma cidade!");
    return;
  }

  resultDiv.innerHTML = "Carregando...";

  try {

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=pt_br&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Cidade não encontrada");
    }

    const data = await response.json();
    lastCityData = data;

    // =============================
    // CÁLCULO DO HORÁRIO LOCAL
    // =============================

    const nowUTC = Date.now() + (new Date().getTimezoneOffset() * 60000);
    const localTime = new Date(nowUTC + (data.timezone * 1000));

    const formattedTime = localTime.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
 

    resultDiv.innerHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <p>🕒 Horário local: ${formattedTime}</p>
      <p>🌡 Temperatura: ${data.main.temp}°C</p>
      <p>🤔 Sensação: ${data.main.feels_like}°C</p>
      <p>💧 Umidade: ${data.main.humidity}%</p>
      <p>🌥 Clima: ${data.weather[0].description}</p>
    `;

    favBtn.style.display = "inline-block";

  } catch (error) {
    resultDiv.innerHTML = "Erro: Cidade não encontrada.";
    favBtn.style.display = "none";
  }

}


// ==========================================
// ADICIONAR AOS FAVORITOS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("addFavoriteBtn").addEventListener("click", () => {

    if (!lastCityData) return;

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    const exists = favorites.find(f =>
      f.name === lastCityData.name &&
      f.country === lastCityData.sys.country
    );

    if (!exists) {

      favorites.push({
        name: lastCityData.name,
        country: lastCityData.sys.country
      });

      localStorage.setItem("favorites", JSON.stringify(favorites));
      loadFavorites();
    }

  });

  loadFavorites();

});


// ==========================================
// CARREGAR FAVORITOS
// ==========================================

function loadFavorites() {

  const favoritesList = document.getElementById("favoritesList");
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  favoritesList.innerHTML = "";

  favorites.forEach((city, index) => {

    const container = document.createElement("div");
    container.className = "favorite-item";

    const btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = `${city.name}, ${city.country}`;

    btn.addEventListener("click", () => {
      document.getElementById("cityInput").value = city.name;
      getWeather();
    });

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-fav";
    removeBtn.textContent = "×";

    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      favorites.splice(index, 1);

      localStorage.setItem("favorites", JSON.stringify(favorites));
      loadFavorites();
    });

    container.appendChild(btn);
    container.appendChild(removeBtn);
    favoritesList.appendChild(container);

  });


}
