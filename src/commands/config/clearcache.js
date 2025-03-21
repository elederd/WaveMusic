const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config(); // Carga variables de entorno en local

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clearcache')
        .setDescription('Limpia la caché y hace deploy en Render'),

    async execute(interaction) {
        await interaction.deferReply();

        // Obtener variables de entorno
        const API_KEY = process.env.APIKEY;
        const SERVICE_ID = process.env.SERVICEID;

        // Validar que las variables de entorno existen
        if (!API_KEY || !SERVICE_ID) {
            console.error("❌ ERROR: APIKEY o SERVICEID no están definidos en las variables de entorno.");
            return await interaction.editReply('❌ **Error: API Key o Service ID no configurados correctamente.**');
        }

        try {
            const response = await axios.post(
                `https://api.render.com/v1/services/${SERVICE_ID}/deploys`,
                {}, 
                { headers: { 'Authorization': `Bearer ${API_KEY}` } }
            );

            if (response.status === 201) {
                await interaction.editReply('✅ **Cache limpiada y despliegue iniciado en Render!**');
            } else {
                console.error("⚠️ Respuesta inesperada de Render API:", response.data);
                await interaction.editReply('⚠️ **No se pudo iniciar el despliegue.**');
            }
        } catch (error) {
            console.error("❌ ERROR en la solicitud a Render API:", error.response?.data || error.message);
            await interaction.editReply(`❌ **Error: ${error.response?.data?.message || error.message}**`);
        }
    }
};
