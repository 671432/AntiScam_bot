const normalize = require("../utils/normalize");

const seen = new Map();
/*
key -> {
  messageId,
  channelId,
  timestamp
}
*/

module.exports = (message) => {
  const content = normalize(message.content);
  if (!content) return null;

  const key = `${message.guild.id}:${content}`;

  if (seen.has(key)) {
    return seen.get(key);
  }

  seen.set(key, {
    messageId: message.id,
    channelId: message.channel.id,
    timestamp: Date.now(),
  });

  setTimeout(() => seen.delete(key), 5 * 60 * 1000);
  return null;
};
