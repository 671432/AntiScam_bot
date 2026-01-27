const normalize = require("../utils/normalize");
const seen = new Map();

module.exports = (message) => {
  const content = normalize(message.content);
  if (!content) return false;

  const key = `${message.guild.id}:${content}`;

  if (seen.has(key)) return true;

  seen.set(key, Date.now());
  setTimeout(() => seen.delete(key), 5 * 60 * 1000); // 5 min window
  return false;
};
