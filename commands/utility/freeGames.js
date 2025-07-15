const { SlashCommandBuilder , EmbedBuilder } = require('discord.js');


async function fetchEpicGamesFreeGames(storeId) {
  try {
    const response = await fetch('https://www.cheapshark.com/api/1.0/deals?storeID=25&upperPrice=1');
    if (response.ok) {
      const data = await response.json(); 
      const freeGames = data.filter(game => game.savings === "100.000000");
      return freeGames
    }
  } catch (error) {
    throw new Error(`Failed to fetch free games: ${error.message}`);
  }
}


module.exports = {
  data: new SlashCommandBuilder()
    .setName('epic_games_deals')
    .setDescription('see the free games on Epic Games Store'),
  async execute(interaction) {
    await interaction.deferReply();
    try {
      const freeGames = await fetchEpicGamesFreeGames(25);
      for (const game of freeGames) {
        const embed = new EmbedBuilder()
          .setTitle(game.title)
          .setDescription(`
            Price: ${game.normalPrice} USD
            Sale Price: ${game.salePrice} USD
            Savings: ${Number(game.savings).toFixed(2)}%
            MetaCritic Score: ${game.metacriticScore || 'N/A'}`
          )
          .setColor('#0099ff')
          .setURL(`https://www.cheapshark.com/redirect?dealID=${game.dealID}`)
          .setImage(game.thumb)
          .setFooter({ text: 'Epic Games Free Deals by nerd bot' });
        await interaction.followUp({ embeds: [embed] });
      }
    } catch (error) {
      console.error('Error fetching free games:', error);
      await interaction.followUp({ content: 'Failed to fetch free games. Please try again later.', ephemeral: true });
    }
  },
};
