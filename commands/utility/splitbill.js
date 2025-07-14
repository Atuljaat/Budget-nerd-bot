const { SlashCommandBuilder } = require('discord.js');

function splitBill (amount, people) {
    if (people <= 0) {
        return 'Number of people must be greater than zero.';
    } 
    
    if (amount < 0) {
        return 'Amount must be a positive number.';
    }
    
    const splitAmount = (amount / people).toFixed(2);
    return `Each person should pay: ${splitAmount}`;
}


module.exports = {
  data: new SlashCommandBuilder()
    .setName('split_bill')
    .setDescription('Splits a bill among multiple people')
    .addNumberOption(option => {
        option.setName('amount')
        option.setDescription('Total amount of the bill')
        option.setRequired(true);
        return option
    } )
    .addNumberOption(option => {
        option.setName('people')
        option.setDescription('Number of people to split the bill')
        option.setRequired(true);
        return option 
    }) 
    ,
  async execute(interaction) {
    const amount = interaction.options.getNumber('amount');
    const people = interaction.options.getNumber('people');
    
    const result = splitBill(amount, people);
    await interaction.reply(result);
  },
};
