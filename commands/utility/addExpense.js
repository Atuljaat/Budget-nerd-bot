const { SlashCommandBuilder } = require('discord.js');
const db = require('../../database/createdb.js');

function addExpense (discordId, username, amount, note = 'nothing') {
  const userInsert = `INSERT OR IGNORE INTO users (discord_id, username) VALUES (?, ?)`
  const userIdQuery = `SELECT id FROM users WHERE discord_id = ?`
  db.run(
    userInsert,
    [discordId, username],
    (err) => {
      if (err) return console.error('User insert error:', err);
      db.get(
        userIdQuery,
        [discordId],
        (err, row) => {
          if (err) return console.error('Get user ID error:', err);
          const userId = row.id;
          console.log(`User ID for ${username} (${discordId}):`, userId);
          db.run(
            `INSERT INTO expenses (user_id, amount, note) VALUES (?, ?, ?)`,
            [userId, amount, note],
            (err) => {
              if (err) console.error('Expense insert error:', err);
              else console.log('Expense added.');
            }
          );
        }
      );
    }
  );
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add_expense')
    .setDescription('adds an expense to the bot')
    .addNumberOption(option => {
      return option.setName("amount")
              .setDescription("What is your expense")
              .setRequired(true)
              .setMinValue(1)
    })
    .addStringOption(option => {
      return option.setName('note')
              .setDescription('Add a note for the expense')
              .setRequired(true);
    })
    .addBooleanOption(option => {
      return option.setName('visibility')
              .setDescription('Should the expense be visible to others?')
              .setRequired(true);
    }),
  async execute(interaction) {
    const amount = interaction.options.getNumber('amount');
    const note = interaction.options.getString('note') || 'nothing';
    const visibility = interaction.options.getBoolean('visibility');
    const discordId = interaction.user.id;
    const username = interaction.user.username;
    addExpense(discordId, username, amount, note);
    if (!visibility) {
       await interaction.reply({
        content : `Expense of ${amount} added with note: "${note}" and is not visible to others.`,
        ephemeral : true
       })
    } else {
      await interaction.reply(`Expense of ${amount} added with note: "${note}"`);
    }
  },
};
