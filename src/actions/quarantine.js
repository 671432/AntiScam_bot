const { EmbedBuilder } = require("discord.js");

module.exports = async (message) => {
  const quarantineChannel = message.guild.channels.cache.get(
    process.env.QUARANTINE_CHANNEL_ID,
  );

  const modLogChannel = message.guild.channels.cache.get(
    process.env.MOD_LOG_CHANNEL_ID,
  );

  const embed = new EmbedBuilder()
    .setTitle("🚨 Quarantined Message")
    .setColor(0xff0000)
    .addFields(
      {
        name: "User",
        value: `${message.author.tag} (<@${message.author.id}>)`,
        inline: true,
      },
      { name: "Channel", value: `<#${message.channel.id}>`, inline: true },
      {
        name: "Timestamp",
        value: `<t:${Math.floor(message.createdTimestamp / 1000)}:F>`,
        inline: false,
      },
      {
        name: "Content",
        value: message.content || "[No Text Content]",
        inline: false,
      },
    );

  if (message.attachments.size) {
    embed.addFields({
      name: "Attachment(s)",
      value: message.attachments.map((a) => a.url).join("\n"),
    });
  }

  // Send to quarantine channel
  await quarantineChannel.send({ embeds: [embed] });

  // Send to mod-log if defined
  if (modLogChannel) {
    await modLogChannel.send({ embeds: [embed] });
  }

  // Delete message safely
  await message.delete().catch(() => null);
};
