const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildMemberUpdate', (oldMember, newMember) => {
  // Check if the user has been added to or removed from the @DogsWL role
  const dogsWLRole = oldMember.guild.roles.cache.find(role => role.name === 'DogsWL');
  if (oldMember.roles.cache.has(dogsWLRole.id) !== newMember.roles.cache.has(dogsWLRole.id)) {
    // The user has been added to or removed from the @DogsWL role
    if (newMember.roles.cache.has(dogsWLRole.id)) {
      // The user has been added to the @DogsWL role
      // Set a timer to check the user's message count 7 days from now
      setTimeout(() => {
        // Get the user's messages from the past 7 days
        const userMessages = newMember.guild.channels.cache
          .filter(channel => channel.type === 'text') // Only consider text channels
          .flatMap(channel => channel.messages.cache) // Flatten the messages into a single array
          .filter(message => message.author.id === newMember.id && message.createdTimestamp > Date.now() - 7 * 24 * 60 * 60 * 1000); // Only consider messages from the user sent in the past 7 days

        if (userMessages.size < 40) {
          // Revoke the @DogsWL role from the user if they have sent less than 40 messages
          newMember.roles.remove(dogsWLRole);
        }
      }, 7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds
    }
  }
});

client.login('your-bot-token-goes-here');
