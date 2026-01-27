const textSpam = require("../detectors/textSpam");
const imageSpam = require("../detectors/imageSpam");
const quarantine = require("../actions/quarantine");
const restrict = require("../actions/restrictUser");

module.exports = (client) => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;

    const firstMatch = textSpam(message);
    const isImageSpam = await imageSpam(message);

    // TEXT SPAM CASE
    if (firstMatch) {
      // quarantine first message
      const channel = await message.guild.channels.fetch(firstMatch.channelId);
      const firstMessage = await channel.messages.fetch(firstMatch.messageId);

      await quarantine(firstMessage);

      // quarantine second message
      await quarantine(message);

      await restrict(message.member);
      return;
    }

    // IMAGE SPAM CASE (same logic, simpler for now)
    if (isImageSpam) {
      await quarantine(message);
      await restrict(message.member);
    }
  });
};
