const { SlashCommandBuilder } = require('discord.js');

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

        try {
            const response = await fetch(`https://api.render.com/v1/services/${SERVICE_ID}/restart`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }

            await interaction.reply({ content: '✅ El bot se está reiniciando en Render.', ephemeral: true });
            console.log('✅ El bot ha recibido la orden de reinicio.');
        } catch (error) {
            console.error('❌ Error al reiniciar el bot:', error);
            await interaction.reply({ content: '❌ Hubo un error al intentar reiniciar el bot.', ephemeral: true });
        }
    }
};
