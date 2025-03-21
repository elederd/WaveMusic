const { SlashCommandBuilder } = require('discord.js');
const https = require('https');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('restart')
        .setDescription('Reinicia el bot en Render'),

    async execute(interaction) {
        // Verificación de permisos (cambia esto por tu ID de Discord)
        const ownerId = '218559611320401920';
        if (interaction.user.id !== ownerId) {
            return await interaction.reply({ content: '❌ No tienes permiso para reiniciar el bot.', ephemeral: true });
        }

        // Variables de entorno
        const API_KEY = process.env.APIKEY;
        const SERVICE_ID = process.env.SERVICEID;

        if (!API_KEY || !SERVICE_ID) {
            console.error('⚠️ APIKEY o SERVICEID no están definidos en las variables de entorno.');
            return await interaction.reply({ content: '❌ Error de configuración del bot.', ephemeral: true });
        }

        // Configuración de la solicitud HTTPS
        const options = {
            hostname: 'api.render.com',
            path: `/v1/services/${SERVICE_ID}/restart`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        };

        // Realizar la solicitud HTTPS
        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', async () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    await interaction.reply({ content: '✅ El bot se está reiniciando en Render.', ephemeral: true });
                    console.log('✅ El bot ha recibido la orden de reinicio.');
                } else {
                    console.error(`❌ Error ${res.statusCode}: ${data}`);
                    await interaction.reply({ content: `❌ Error al reiniciar el bot: ${res.statusCode}`, ephemeral: true });
                }
            });
        });

        req.on('error', async (error) => {
            console.error('❌ Error al reiniciar el bot:', error);
            await interaction.reply({ content: '❌ Hubo un error al intentar reiniciar el bot.', ephemeral: true });
        });

        req.end();
    }
};
