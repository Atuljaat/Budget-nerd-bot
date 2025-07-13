const { SlashCommandBuilder } = require('discord.js');
const budgetTips = require('../../data/budgetTips.js');

function getRandomTip() {
    const randomIndex = Math.floor(Math.random() * dailytips.length);
    return budgetTips[randomIndex].tip;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('budget_tip')
    .setDescription('Replies with a random budget tip'),
  async execute(interaction) {
    const tip = getRandomTip();
    await interaction.reply(` ${tip}`);
  },
};
