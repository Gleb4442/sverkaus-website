"use strict";
const config = JSON.parse(document.getElementById("release-config").textContent);
let language = localStorage.getItem("any-site-language") === "en" ? "en" : "ru";
let mode = "local";
const translated = [...document.querySelectorAll("[data-en]")];
translated.forEach(node => { node.dataset.ru = node.textContent; });
const copy = {
  ru: { local: ["НА ЭТОМ MAC", "Речь остаётся рядом.", "Whisper или Apple Speech распознают речь на устройстве. Для структуры и правки голосом можно скачать отдельную текстовую модель.", "Речь", "Ваш Mac", "Текст", "Модели нужно сначала загрузить. Доступность Apple Speech зависит от языка и macOS."], cloud: ["ЯВНЫЙ ВЫБОР ОБЛАКА", "Groq с вашим ключом.", "Речь и запросы обработки текста отправляются в Groq. Вы управляете ключом, режимом и лимитами своего аккаунта.", "Речь", "Groq", "Текст", "Нужны интернет и собственный Groq-ключ. any не включает оплату использования Groq."], download: "Скачать для Mac", pending: "Релиз готовится" },
  en: { local: ["ON THIS MAC", "Keep speech close.", "Whisper or Apple Speech recognize speech on your device. Download a separate text model for structure and voice edits.", "Speech", "Your Mac", "Text", "Download models first. Apple Speech availability depends on the language and macOS."], cloud: ["AN EXPLICIT CLOUD CHOICE", "Groq with your key.", "Speech and text processing requests are sent to Groq. You control your key, mode, and account limits.", "Speech", "Groq", "Text", "Requires internet and your own Groq key. any does not include payment for Groq usage."], download: "Download for Mac", pending: "Release in preparation" }
};
function render() {
  document.documentElement.lang = language;
  document.title = language === "ru" ? "any — речь становится текстом" : "any — less typing, more you";
  translated.forEach(node => { node.textContent = node.dataset[language].replaceAll("\\n", "\n"); });
  document.getElementById("language").textContent = language === "ru" ? "EN" : "RU";
  const state = copy[language][mode];
  ["mode-tag", "mode-title", "mode-description", "flow-start", "flow-engine", "flow-end", "mode-limit"].forEach((id, i) => { document.getElementById(id).textContent = state[i]; });
  for (const id of ["local", "cloud"]) {
    document.getElementById(id).classList.toggle("active", mode === id);
    document.getElementById(id).setAttribute("aria-pressed", String(mode === id));
  }
  for (const link of document.querySelectorAll(".download")) {
    link.textContent = config.downloadURL ? copy[language].download : copy[language].pending;
    link.setAttribute("aria-disabled", String(!config.downloadURL));
    if (config.downloadURL) link.href = config.downloadURL;
  }
  const support = document.getElementById("support");
  if (config.supportURL) { support.href = config.supportURL; support.hidden = false; }
}
document.getElementById("language").addEventListener("click", () => { language = language === "ru" ? "en" : "ru"; localStorage.setItem("any-site-language", language); render(); });
for (const id of ["local", "cloud"]) document.getElementById(id).addEventListener("click", () => { mode = id; render(); });
render();
