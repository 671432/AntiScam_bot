module.exports = async (message) => {
  const channel = message.guild.channels.cache.get(
    process.env.QUARANTINE_CHANNEL_ID,
  );

  await channel.send({
    content: `Quarantined message from ${message.author.tag}\n${message.content || "[image]"}`,
  });

  await message.delete();
};
