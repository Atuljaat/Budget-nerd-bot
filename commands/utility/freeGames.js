const { SlashCommandBuilder , EmbedBuilder } = require('discord.js');


async function fetchEpicGamesFreeGames(storeId) {
  try {
    const response = await fetch('https://www.cheapshark.com/api/1.0/deals?storeID=25&upperPrice=1');
    if (response.ok) {
      const data = await response.json();
      // console.log(data);
      const freeGames = data.filter(game => game.savings === "100.000000");
      fs.writeFileSync('freeGamesFiltered.json', JSON.stringify(freeGames));
    }
  } catch (error) {
    throw new Error(`Failed to fetch free games: ${error.message}`);
  }
}


fetchEpicGamesFreeGames(25);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('epic_games_deals')
    .setDescription('see the free games on Epic Games Store'),
  async execute(interaction) {
    await interaction.reply('Hello! Pong!');
  },
};
