const textSpam = require("../detectors/textSpam");
const imageSpam = require("../detectors/imageSpam");
const quarantine = require("../actions/quarantine");
const restrict = require("../actions/restrictUser");

module.exports = (client) => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;

    const isTextSpam = textSpam(message);
    const isImageSpam = await imageSpam(message);

    if (isTextSpam || isImageSpam) {
      await quarantine(message);
      await restrict(message.member);
    }
  });
};
