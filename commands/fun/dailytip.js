const { SlashCommandBuilder } = require('discord.js');
const dailytips = require('../../data/dailytip.js');

function getRandomTip() {
    const randomIndex = Math.floor(Math.random() * dailytips.length);
    return dailytips[randomIndex].tip;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily_tip')
    .setDescription('Replies with a daily tip'),
  async execute(interaction) {
    const tip = getRandomTip();
    await interaction.reply(` ${tip}`);
  },
};
