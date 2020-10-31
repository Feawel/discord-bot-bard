const _ = require('lodash/fp')
const Discord = require('discord.js')
const commands = require('./service/commands')

const client = new Discord.Client()
let dispatcher = {}

const rexWelcome = /(?=.*\b(hello|bonjour)\b)/i
const rexBirthday = /(?=.*\b(naissance|ne|nee)\b)(?=.*\b(quand)\b)/i
const rexRobot = /(?=.*\b(robot|robots)\b)/i
const rexVoiceJoin = /(?=.*\b(join|viens on est bien)\b)/i
const rexVoicePlay = /(?=.*\b(play)\b)/i
const rexVoiceStop = /(?=.*\b(stop|pause)\b)/i
const rexVoiceResume = /(?=.*\b(resume)\b)/i
const rexVoiceDisconnect = /(?=.*\b(disconnect)\b)/i

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
})

client.on('error', (err) => {
  console.log(err)
  console.log(`Logged in as ${client.user.tag}!`);
})

client.on('message', async message => {
  // Voice only works in guilds, if the message does not come from a guild,
  // we ignore it
  if (!message.guild) return

  const content = _.getOr('', 'content', message)

  switch (true) {
    case rexWelcome.test(content):
      return commands.handleWelcome(message)
    
    case rexBirthday.test(content):
      return commands.handleBirthday(message)

    case rexRobot.test(content):
      return commands.handleRobot(message)

    case rexVoiceJoin.test(content):
      return commands.handleVoiceJoin(message)

    case rexVoicePlay.test(content): {
      const guildDispatcher = commands.handleVoicePlay(message)
      dispatcher[_.get('guild.id', message)] = await guildDispatcher
      break
    }

    case rexVoiceStop.test(content):
      return commands.handleVoiceStop(dispatcher[_.get('guild.id', message)])
    case rexVoiceResume.test(content):
      return commands.handleVoiceResume(dispatcher[_.get('guild.id', message)])

    case rexVoiceDisconnect.test(content): {
      await commands.handleVoiceDisconnect(message)
      const guildDispatcher = dispatcher[_.get('guild.id', message)]
      if(guildDispatcher) guildDispatcher.destroy()
    }

    default:
      break;
  }


})

console.log(process.env.DISCORD_TOKEN)

client.login(process.env.DISCORD_TOKEN)
