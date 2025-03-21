const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('restart')
        .setDescription('Reinicia el bot en Render'),
    async execute(interaction) {
        const API_KEY = process.env.APIKEY;
        const SERVICE_ID = process.env.SERVICEID;

        try {
            const response = await fetch(`https://api.render.com/v1/services/${SERVICE_ID}/restart`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error(`Error: ${response.statusText}`);

            await interaction.reply('✅ El bot se está reiniciando en Render.');
        } catch (error) {
            console.error('Error al reiniciar el bot:', error);
            await interaction.reply('❌ Hubo un error al intentar reiniciar el bot.');
        }
    }
};
