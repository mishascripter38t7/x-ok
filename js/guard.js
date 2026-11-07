// Защита от ненормативной лексики и XSS-скриптов
const BAD_WORDS = ["бля", "блять", "хуй", "хуесос", "пидор", "пидр", "чмо", "ебать", "гандон", "порно", "18+"];

export function checkSafety(text) {
  if (!text) return { safe: true };
  
  // Экранирование HTML-тегов и скриптов (XSS Защита)
  const sanitized = text.replace(/[&<>'"]/g, tag => 
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );

  // Очистка текста от точек, пробелов и цифр-заменителей для проверки на мат
  const clean = sanitized.toLowerCase().replace(/[\s._\-+*,\/]/g, '').replace(/0/g, 'о').replace(/1/g, 'и');
  
  for (let word of BAD_WORDS) {
    if (clean.includes(word)) {
      return { safe: false, reason: `Контент содержит запрещенное слово: "${word}"` };
    }
  }

  return { safe: true, text: sanitized };
}
