const { SlashCommandBuilder } = require('discord.js');

const RENDER_API_KEY = process.env.APIKEY; // Reemplaza con tu API Key de Render
const SERVICE_ID = process.env.SERVICEID; // Reemplaza con el ID de tu servicio en Render

module.exports = {
    data: new SlashCommandBuilder()
        .setName('restart')
        .setDescription('Reinicia el bot en Render'),
    async execute(interaction) {
        await interaction.deferReply();
        try {
            const response = await fetch(`https://api.render.com/v1/services/${SERVICE_ID}/restart`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${RENDER_API_KEY}`
                }
            });
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            await interaction.editReply('🔄 El bot se está reiniciando en Render.');
        } catch (error) {
            console.error('Error al reiniciar:', error.message);
            await interaction.editReply('❌ Error al reiniciar el bot.');
        }
    }
};
