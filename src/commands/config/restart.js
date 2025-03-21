const { SlashCommandBuilder } = require('discord.js');

var RENDER_API_KEY = process.env.APIKEY; // Reemplaza con tu API Key de Render
var SERVICE_ID = process.env.SERVICEID; // Reemplaza con el ID de tu servicio en Render

module.exports = {
    data: new SlashCommandBuilder()
        .setName('restart')
        .setDescription('Reinicia el bot en Render'),
    async execute(interaction) {
        await interaction.deferReply();
        try {
            var response = await fetch(`https://api.render.com/v1/services/${SERVICE_ID}/restart`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${RENDER_API_KEY}`
                }
            });
            if (!response.ok) throw new Error();
            await interaction.editReply('🔄 El bot se está reiniciando en Render.');
        } catch (error) {
            await interaction.editReply('❌ Error al reiniciar el bot.');
        }
    }
};
