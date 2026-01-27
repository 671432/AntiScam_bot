module.exports = async (member) => {
  const role = member.guild.roles.cache.get(process.env.RESTRICTED_ROLE_ID);
  if (role && !member.roles.cache.has(role.id)) {
    await member.roles.add(role);
  }
};
