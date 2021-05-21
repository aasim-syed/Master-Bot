const { Command } = require('discord.js-commando');

module.exports = class RemindCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'remind',
      aliases: ['alarm', 'timer', 'remind-me'],
      group: 'guild',
      memberName: 'remind',
      description: 'Sets a timed alert',
      userPermissions: ['ADMINISTRATOR'],
      examples: ['!remind "Cookies" 2 h', '!remind "Cookies" 2 h @everyone'],
      guildOnly: true,
      args: [
        {
          key: 'reminderMessage',
          prompt: 'What would you like the reminder to say?',
          type: `string`
        },
        {
          key: 'number',
          prompt: 'Enter a **Number** for your units',
          type: 'integer',
          validate: function checkNumber(num) {
            if (num > 0) return true;
          },
          error: ':x: Must be a **Number** and greater than 0.'
        },
        {
          key: 'unit',
          prompt: 'What is the **Unit** of time?',
          type: 'string',
          validate: function validateUnits(units) {
            if (units.toLowerCase().startsWith('w')) return true;
            if (units.toLowerCase().startsWith('d')) return true;
            if (units.toLowerCase().startsWith('h')) return true;
            if (units.toLowerCase().startsWith('m')) return true;
          },
          error: `:x: Please try again.
           Options are ** Weeks **, ** Days **, ** Hours **, or **Minutes** `
        },
        {
          key: 'mention',
          prompt: 'Who do you want to remind?',
          type: 'user|role',
          default: 'author',
          error: ':x: Please try again with a valid role or user.'
        }
      ]
    });
  }

  run(message, { reminderMessage, number, unit, mention }) {
    unit = unit.toLowerCase();
    // Max possible number is (30,758,400,000) because of the MS conversion
    if (
      (number > 52 && unit.startsWith('w')) ||
      (number > 365 && unit.startsWith('d')) ||
      (number > 8544 && unit.startsWith('h')) ||
      (number > 512640 && unit.startsWith('m'))
    ) {
      return message.channel.send(`:x: Sorry **${number} ${unit}** is to long`);
    }

    const timer = unit.startsWith('w')
      ? number * 10080
      : null || unit.startsWith('d')
      ? number * 1440
      : null || unit.startsWith('h')
      ? number * 60
      : number;

    message.channel.send(
      `:white_check_mark: Reminder is set: ${reminderMessage}`
    );
    setTimeout(() => {
      if (mention == 'author') {
        message.reply(`:alarm_clock: Reminder: ${reminderMessage}`);
      } else {
        message.channel.send(
          `${mention} :alarm_clock: Reminder: ${reminderMessage}`
        );
      }
    }, timer * 60000);
  }
};
