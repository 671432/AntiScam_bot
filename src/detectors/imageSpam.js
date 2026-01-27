const { imageHash } = require("image-hash");

const hashes = new Map();
/*
hash -> {
  messageId,
  channelId,
  timestamp
}
*/

module.exports = async (message) => {
  if (!message.attachments.size) return null;

  const attachment = message.attachments.first();
  if (!attachment.contentType?.startsWith("image")) return null;

  const hash = await new Promise((resolve) => {
    imageHash(attachment.url, 16, true, (error, data) => {
      if (error) resolve(null);
      else resolve(data);
    });
  });

  if (!hash) return null;

  if (hashes.has(hash)) {
    // return the first message info
    return hashes.get(hash);
  }

  // store the first message
  hashes.set(hash, {
    messageId: message.id,
    channelId: message.channel.id,
    timestamp: Date.now(),
  });

  // clean up after 10 minutes
  setTimeout(() => hashes.delete(hash), 10 * 60 * 1000);

  return null;
};
