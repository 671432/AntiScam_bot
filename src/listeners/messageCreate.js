const textSpam = require("../detectors/textSpam");
const imageSpam = require("../detectors/imageSpam");
const quarantine = require("../actions/quarantine");
const restrict = require("../actions/restrictUser");

module.exports = (client) => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;

    // Check text spam first
    const firstTextMatch = textSpam(message);

    if (firstTextMatch) {
      const channel = await message.guild.channels.fetch(
        firstTextMatch.channelId,
      );
      const firstMessage = await channel.messages
        .fetch(firstTextMatch.messageId)
        .catch(() => null);

      if (firstMessage) await quarantine(firstMessage);
      await quarantine(message);

      if (!message.member) {
        message.member = await message.guild.members
          .fetch(message.author.id)
          .catch(() => null);
      }
      if (message.member) await restrict(message.member);
      return;
    }

    // Check image spam
    const firstImageMatch = await imageSpam(message);

    if (firstImageMatch) {
      const channel = await message.guild.channels.fetch(
        firstImageMatch.channelId,
      );
      const firstMessage = await channel.messages
        .fetch(firstImageMatch.messageId)
        .catch(() => null);

      if (firstMessage) await quarantine(firstMessage);
      await quarantine(message);

      if (!message.member) {
        message.member = await message.guild.members
          .fetch(message.author.id)
          .catch(() => null);
      }
      if (message.member) await restrict(message.member);
      return;
    }
  });
};
