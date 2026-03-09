const $ = (id) => document.getElementById(id);

/* =========================
   Données
========================= */

const J_PER_TOKEN = {
  "gpt-4o-mini": 0.40,
  "gpt-4o": 0.80,
  "gpt-3.5": 0.30,
  "llama3-8b": 0.35,
  "llama3-70b": 1.50,
  "mistral-7b": 0.30,
};

const CARBON_INTENSITY = {
  FR: 50,
  DE: 400,
  ES: 180,
};

const SMARTPHONE_BATTERY_WH = 12;
const LED_POWER_W = 10;
const LAPTOP_POWER_W = 60;
const CAR_CO2_G_PER_KM = 120;
const TREE_CO2_G_PER_YEAR = 25000;
const EMAIL_CO2_G = 0.3;

/* =========================
   Calculs
========================= */

function estimateTokens(text) {
  const cleanText = (text || "").trim();

  if (cleanText.length === 0) {
    return 0;
  }

  return Math.ceil(cleanText.length / 4);
}

function joulesToKwh(joules) {
  return joules / 3600000;
}

function kwhToWh(kwh) {
  return kwh * 1000;
}

function computeEnergy(tokens, model) {
  const jPerToken = J_PER_TOKEN[model] || 0;
  const energyJ = tokens * jPerToken;

  return joulesToKwh(energyJ);
}

function computeCo2(kwh, country) {
  const carbonIntensity = CARBON_INTENSITY[country] || 0;
  return kwh * carbonIntensity;
}

function computeEcoScore(energyWh) {
  const score = 100 * Math.exp(-energyWh / 1.5);
  return Math.max(0, Math.min(100, Math.round(score)));
}

/* =========================
   Comparaisons vie réelle
========================= */

function computeRealLifeComparisons(energyKwh, co2g) {
  const energyWh = kwhToWh(energyKwh);

  const smartphonePercent = (energyWh / SMARTPHONE_BATTERY_WH) * 100;
  const ledSeconds = (energyWh / LED_POWER_W) * 3600;
  const laptopSeconds = (energyWh / LAPTOP_POWER_W) * 3600;
  const carKm = co2g / CAR_CO2_G_PER_KM;
  const emails = co2g / EMAIL_CO2_G;
  const treeYears = co2g / TREE_CO2_G_PER_YEAR;

  return {
    smartphonePercent,
    ledSeconds,
    laptopSeconds,
    carKm,
    emails,
    treeYears,
  };
}

/* =========================
   Format
========================= */

function formatEnergy(kwh) {
  const wh = kwhToWh(kwh);

  if (wh < 1) {
    return `${wh.toFixed(4)} Wh`;
  }

  if (kwh < 1) {
    return `${wh.toFixed(2)} Wh`;
  }

  return `${kwh.toFixed(4)} kWh`;
}

function formatCo2(grams) {
  if (grams < 1) {
    return `${grams.toFixed(4)} gCO₂`;
  }

  if (grams < 1000) {
    return `${grams.toFixed(2)} gCO₂`;
  }

  return `${(grams / 1000).toFixed(3)} kgCO₂`;
}

function formatSeconds(seconds) {
  if (seconds < 60) {
    return `${seconds.toFixed(1)} secondes`;
  }

  const minutes = seconds / 60;

  if (minutes < 60) {
    return `${minutes.toFixed(1)} minutes`;
  }

  const hours = minutes / 60;
  return `${hours.toFixed(2)} heures`;
}

function formatCount(value) {
  if (value < 1) {
    return value.toFixed(2);
  }

  if (value < 10) {
    return value.toFixed(1);
  }

  return value.toFixed(0);
}

/* =========================
   Interface
========================= */

function updateCarbonPill() {
  const countrySelect = $("countrySelect");
  const ciValue = $("ciValue");

  if (!countrySelect || !ciValue) {
    return;
  }

  const country = countrySelect.value;
  ciValue.textContent = CARBON_INTENSITY[country] ?? "-";
}

function resetResults() {
  $("tokensIn").textContent = "-";
  $("energy").textContent = "-";
  $("co2").textContent = "-";
  $("score").textContent = "-";

  $("phone").textContent = "-";
  $("bulb").textContent = "-";
  $("laptop").textContent = "-";
  $("car").textContent = "-";
  $("email").textContent = "-";
  $("tree").textContent = "-";
}

/* =========================
   Analyse du prompt
========================= */

function analyzePrompt() {
  const prompt = $("promptInput").value;
  const model = $("modelSelect").value;
  const country = $("countrySelect").value;

  const tokens = estimateTokens(prompt);

  if (tokens === 0) {
    resetResults();
    return;
  }

  const energyKwh = computeEnergy(tokens, model);
  const co2 = computeCo2(energyKwh, country);
  const energyWh = kwhToWh(energyKwh);
  const score = computeEcoScore(energyWh);

  const comparisons = computeRealLifeComparisons(energyKwh, co2);

  $("tokensIn").textContent = tokens;
  $("energy").textContent = formatEnergy(energyKwh);
  $("co2").textContent = formatCo2(co2);
  $("score").textContent = `${score}/100`;

  $("phone").textContent = `${comparisons.smartphonePercent.toFixed(3)} %`;
  $("bulb").textContent = formatSeconds(comparisons.ledSeconds);
  $("laptop").textContent = formatSeconds(comparisons.laptopSeconds);
  $("car").textContent = `${comparisons.carKm.toFixed(4)} km`;
  $("email").textContent = formatCount(comparisons.emails);
  $("tree").textContent = `${comparisons.treeYears.toFixed(6)} années`;
}

/* =========================
   Initialisation
========================= */

document.addEventListener("DOMContentLoaded", () => {
  const countrySelect = $("countrySelect");
  const analyzeBtn = $("analyzeBtn");
  const promptInput = $("promptInput");
  const modelSelect = $("modelSelect");

  updateCarbonPill();
  resetResults();

  if (countrySelect) {
    countrySelect.addEventListener("change", () => {
      updateCarbonPill();
      analyzePrompt();
    });
  }

  if (modelSelect) {
    modelSelect.addEventListener("change", analyzePrompt);
  }

  if (analyzeBtn) {
    analyzeBtn.addEventListener("click", analyzePrompt);
  }

  if (promptInput) {
    promptInput.addEventListener("input", () => {
      if (promptInput.value.trim() === "") {
        resetResults();
      }
    });
  }
});