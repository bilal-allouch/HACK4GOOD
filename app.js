const $ = (id) => document.getElementById(id);
 
/* =========================
   Données locales
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
   Fonctions de calcul
========================= */
 
function estimateTokens(text) {
  const cleanText = (text || "").trim();
  if (cleanText.length === 0) return 0;
  return Math.ceil(cleanText.length / 4);
}
 
function joulesToKwh(joules) {
  return joules / 3600000;
}
 
function kwhToWh(kwh) {
  return kwh * 1000;
}
 
function computePromptEnergyKwh(tokens, modelKey) {
  const jPerToken = J_PER_TOKEN[modelKey] || 0;
  const energyJoules = tokens * jPerToken;
  return joulesToKwh(energyJoules);
}
 
function computePromptCo2(energyKwh, countryCode) {
  const carbonIntensity = CARBON_INTENSITY[countryCode] || 0;
  return energyKwh * carbonIntensity;
}
 
function computeEcoScore(energyWh) {
  const rawScore = 100 * Math.exp(-energyWh / 1.5);
  return Math.max(0, Math.min(100, Math.round(rawScore)));
}
 
function getPromptsCount(period, frequencyMinutes) {
  const promptsPerHour = 60 / frequencyMinutes;
 
  if (period === "day") {
    return promptsPerHour * 24;
  }
 
  if (period === "week") {
    return promptsPerHour * 24 * 7;
  }
 
  return 0;
}
 
function getAnnualPromptsCount(frequencyMinutes) {
  const promptsPerHour = 60 / frequencyMinutes;
  return promptsPerHour * 24 * 365;
}
 
/* =========================
   Formatage
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
 
function formatCo2(g) {
  if (g < 1) {
    return `${g.toFixed(4)} gCO₂`;
  }
 
  if (g < 1000) {
    return `${g.toFixed(2)} gCO₂`;
  }
 
  return `${(g / 1000).toFixed(3)} kgCO₂`;
}
 
function formatSeconds(seconds) {
  if (seconds < 60) {
    return `${seconds.toFixed(0)} secondes`;
  }
 
  const minutes = seconds / 60;
  if (minutes < 60) {
    return `${minutes.toFixed(1)} minutes`;
  }
 
  const hours = minutes / 60;
  return `${hours.toFixed(2)} heures`;
}
 
function formatTreeTime(minutes) {
  if (minutes < 60) {
    return `${minutes.toFixed(1)} minutes`;
  }
 
  const hours = minutes / 60;
  if (hours < 24) {
    return `${hours.toFixed(2)} heures`;
  }
 
  const days = hours / 24;
  return `${days.toFixed(2)} jours`;
}
 
function formatCount(value) {
  if (value < 1) return value.toFixed(2);
  if (value < 10) return value.toFixed(1);
  return value.toFixed(0);
}
 
/* =========================
   Comparaisons
========================= */
 
function computeRealLifeComparisons(energyKwh, co2g) {
  const energyWh = kwhToWh(energyKwh);
 
  const smartphonePercent = (energyWh / SMARTPHONE_BATTERY_WH) * 100;
  const ledSeconds = (energyWh / LED_POWER_W) * 3600;
  const laptopSeconds = (energyWh / LAPTOP_POWER_W) * 3600;
 
  const carKm = co2g / CAR_CO2_G_PER_KM;
  const carCm = carKm * 100000;
 
  const emails = co2g / EMAIL_CO2_G;
 
  const treeYears = co2g / TREE_CO2_G_PER_YEAR;
  const treeMinutes = treeYears * 365 * 24 * 60;
 
  return {
    smartphonePercent,
    ledSeconds,
    laptopSeconds,
    carCm,
    emails,
    treeMinutes,
  };
}
 
/* =========================
   Affichage
========================= */
 
function updateCarbonPill() {
  const countryCode = $("countrySelect").value;
  const ci = CARBON_INTENSITY[countryCode];
  $("ciValue").textContent = Number.isFinite(ci) ? ci : "-";
}
 
function resetResults() {
  $("tokensIn").textContent = "-";
  $("energy").textContent = "-";
  $("co2").textContent = "-";
  $("score").textContent = "-";
 
  $("selectedPeriod").textContent = "-";
  $("selectedFrequency").textContent = "-";
  $("estimatedPrompts").textContent = "-";
  $("usageEnergy").textContent = "-";
  $("usageCo2").textContent = "-";
 
  $("phone").textContent = "-";
  $("bulb").textContent = "-";
  $("laptop").textContent = "-";
  $("car").textContent = "-";
  $("email").textContent = "-";
  $("tree").textContent = "-";
 
  $("annualPrompts").textContent = "-";
  $("annualEnergy").textContent = "-";
  $("annualCo2").textContent = "-";
}
 
function updateUsageLabels(period, frequency) {
  $("selectedPeriod").textContent =
    period === "day" ? "Par jour" : "Par semaine";
 
  $("selectedFrequency").textContent =
    frequency === 5
      ? "1 prompt toutes les 5 minutes"
      : "1 prompt toutes les 10 minutes";
}
 
function displayComparisons(comparisons) {
  $("phone").textContent = `${comparisons.smartphonePercent.toFixed(3)} %`;
  $("bulb").textContent = formatSeconds(comparisons.ledSeconds);
  $("laptop").textContent = formatSeconds(comparisons.laptopSeconds);
 
  $("car").textContent =
    comparisons.carCm < 1
      ? `${comparisons.carCm.toFixed(2)} cm`
      : `${comparisons.carCm.toFixed(0)} cm`;
 
  $("email").textContent = formatCount(comparisons.emails);
  $("tree").textContent = formatTreeTime(comparisons.treeMinutes);
}
 
/* =========================
   Analyse principale
========================= */
 
function analyzePrompt() {
  const prompt = $("promptInput").value;
  const modelKey = $("modelSelect").value;
  const countryCode = $("countrySelect").value;
  const period = $("periodSelect").value;
  const frequency = Number($("frequencySelect").value);
 
  const tokens = estimateTokens(prompt);
 
  if (tokens === 0) {
    resetResults();
    updateCarbonPill();
    return;
  }
 
  const promptEnergyKwh = computePromptEnergyKwh(tokens, modelKey);
  const promptCo2 = computePromptCo2(promptEnergyKwh, countryCode);
  const promptEnergyWh = kwhToWh(promptEnergyKwh);
  const ecoScore = computeEcoScore(promptEnergyWh);
 
  const promptsCount = getPromptsCount(period, frequency);
  const usageEnergyKwh = promptEnergyKwh * promptsCount;
  const usageCo2 = promptCo2 * promptsCount;
 
  const annualPrompts = getAnnualPromptsCount(frequency);
  const annualEnergyKwh = promptEnergyKwh * annualPrompts;
  const annualCo2 = promptCo2 * annualPrompts;
 
  const comparisons = computeRealLifeComparisons(usageEnergyKwh, usageCo2);
 
  $("tokensIn").textContent = tokens;
  $("energy").textContent = formatEnergy(promptEnergyKwh);
  $("co2").textContent = formatCo2(promptCo2);
  $("score").textContent = `${ecoScore}/100`;
 
  updateUsageLabels(period, frequency);
  $("estimatedPrompts").textContent = `${promptsCount}`;
  $("usageEnergy").textContent = formatEnergy(usageEnergyKwh);
  $("usageCo2").textContent = formatCo2(usageCo2);
 
  displayComparisons(comparisons);
 
  $("annualPrompts").textContent = `${Math.round(annualPrompts)}`;
  $("annualEnergy").textContent = formatEnergy(annualEnergyKwh);
  $("annualCo2").textContent = formatCo2(annualCo2);
}
 
/* =========================
   Events
========================= */
 
document.addEventListener("DOMContentLoaded", () => {
  updateCarbonPill();
  resetResults();
 
  $("countrySelect").addEventListener("change", updateCarbonPill);
  $("analyzeBtn").addEventListener("click", analyzePrompt);
});
 