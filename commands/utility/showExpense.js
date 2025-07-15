const { SlashCommandBuilder , AttachmentBuilder } = require('discord.js');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const fs = require('fs');
const db = require('../../database/createdb.js');

const width = 800
const height = 400
const Canvas  = new ChartJSNodeCanvas({ width, height });

async function getExpenses(discordId) {
  const userIdQuery = `SELECT id FROM users WHERE discord_id = ?`;
  return new Promise((resolve, reject) => {
    db.get(userIdQuery, [discordId], (err, row) => {
      if (err) return reject(err);
      if (!row) return resolve([]);
      const userId = row.id;
      const expensesQuery = `
    SELECT DATE(created_at) as date, SUM(amount) as total
    FROM expenses
    WHERE user_id = ? AND DATE(created_at) >= DATE('now', '-30 days')
    GROUP BY DATE(created_at)
    ORDER BY DATE(created_at)`;
      db.all(expensesQuery, [userId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  });
}

// Expenses: [
//   { amount: 1231, note: 'nothing', created_at: '2025-07-14 10:16:53' },
//   { amount: 3213, note: 'GROCERy', created_at: '2025-07-14 10:20:56' },
//   { amount: 20, note: 'rickshaw', created_at: '2025-07-14 10:27:38' },
//   { amount: 231, note: 'hello', created_at: '2025-07-14 10:27:56' },
//   { amount: 13, note: 'das', created_at: '2025-07-14 10:30:25' }
// ]

async function generateChart(expenses) {
    const labels = expenses.map(exp => exp.date);
    const data = expenses.map(exp => exp.total);
    // console.log('Labels:', labels);
    // console.log('Data:', data);
    const chartConfig = {
        type: 'bar',
        data: {
        labels: labels,
        datasets: [{
            label: 'Expense by Date',
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            fill : false,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
        },
        options: {
        scales: {
            y: {
            beginAtZero: true
            }
        }
        }
    };
    
    return await Canvas.renderToBuffer(chartConfig);
}


module.exports = {
  data: new SlashCommandBuilder()
    .setName('show_expense')
    .setDescription('Shows your expenses')
    .addBooleanOption(option => {
        return option.setName('visibility')
                .setDescription('Should the expense be visible to others?')
                .setRequired(true);
        }
    )
    ,
  async execute(interaction) {
    const discordId = interaction.user.id;
    const expenses = await getExpenses(discordId);
    // console.log('Fetched expenses:', expenses);
    const chartBuffer = await generateChart(expenses);
    const attachment = new AttachmentBuilder(chartBuffer, { name: 'expenses-chart.png' });
    interaction.reply({
      content: 'Here is your expense chart:',
      files: [attachment],
        ephemeral: interaction.options.getBoolean('visibility') ? false : true
    });
    // console.log('Expenses:', expenses);
  },
};
