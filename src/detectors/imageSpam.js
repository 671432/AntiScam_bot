const { imageHash } = require("image-hash");

const hashes = new Map();

module.exports = async (message) => {
  if (!message.attachments.size) return false;

  const attachment = message.attachments.first();
  if (!attachment.contentType?.startsWith("image")) return false;

  const hash = await new Promise((resolve) => {
    imageHash(attachment.url, 16, true, (error, data) => {
      if (error) resolve(null);
      else resolve(data);
    });
  });

  if (!hash) return false;

  if (hashes.has(hash)) return true;

  hashes.set(hash, Date.now());
  setTimeout(() => hashes.delete(hash), 10 * 60 * 1000);
  return false;
};
