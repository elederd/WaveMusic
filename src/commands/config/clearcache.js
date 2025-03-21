const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clearcache')
        .setDescription('Limpia la caché y hace deploy en Render'),
    async execute(interaction) {
        await interaction.deferReply();

        const API_KEY = process.env.APIKEY;  // Reemplaza con tu API Key
        const SERVICE_ID = process.env.SERVICEID;   // Reemplaza con el ID de tu servicio en Render

        try {
            const response = await axios.post(
                `https://api.render.com/v1/services/${SERVICE_ID}/deploys`,
                {}, 
                { headers: { 'Authorization': `Bearer ${API_KEY}` } }
            );

            if (response.status === 201) {
                await interaction.editReply('✅ **Cache limpiada y despliegue iniciado en Render!**');
            } else {
                await interaction.editReply('⚠️ **No se pudo iniciar el despliegue.**');
            }
        } catch (error) {
            console.error(error);
            await interaction.editReply('❌ **Error al intentar limpiar la caché y desplegar.**');
        }
    }
};
