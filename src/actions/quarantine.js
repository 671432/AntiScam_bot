module.exports = async (message) => {
  const channel = message.guild.channels.cache.get(
    process.env.QUARANTINE_CHANNEL_ID,
  );

  await channel.send({
    content: `Quarantined message from ${message.author.tag}\n${message.content || "[image]"}`,
  });

  await message.delete();
};

const { EmbedBuilder } = require("discord.js");

module.exports = async (message) => {
  const quarantineChannel = message.guild.channels.cache.get(
    process.env.QUARANTINE_CHANNEL_ID,
  );

  const modLogChannel = message.guild.channels.cache.get(
    process.env.MOD_LOG_CHANNEL_ID,
  );

  const embed = new EmbedBuilder()
    .setTitle("🚨 Scam message quarantined")
    .setDescription(message.content || "[Image]")
    .addFields(
      { name: "User", value: `${message.author.tag}` },
      { name: "Channel", value: `<#${message.channel.id}>` },
    )
    .setTimestamp();

  await quarantineChannel.send({ embeds: [embed] });

  if (modLogChannel) {
    await modLogChannel.send({ embeds: [embed] });
  }

  await message.delete();
};
