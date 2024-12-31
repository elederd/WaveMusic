const Command = require("../../structures/Command.js");

module.exports = class LavaLink extends Command {
  constructor(client) {
    super(client, {
      name: "lavalink",
      description: {
        content: "Shows the current Lavalink stats",
        examples: ["lavalink"],
        usage: "lavalink",
      },
      category: "info",
      aliases: ["ll"],
      cooldown: 3,
      args: false,
      player: {
        voice: false,
        dj: false,
        active: false,
        djPerm: null,
      },
      permissions: {
        dev: false,
        client: ["SendMessages", "ViewChannel", "EmbedLinks"],
        user: [],
      },
      slashCommand: true,
    });
  }

  async run(client, ctx) {
    const embed = this.client.embed();
    embed.setTitle("🌐 Lavalink Status");
    embed.setColor(this.client.color.main);
    embed.setThumbnail(this.client.user.avatarURL({}));
    embed.setDescription(
        "🟢 = Activo | 🔴 = Inactivo"
    );
    embed.setFooter({
      text: `Solicitado por ${ctx.author.username}`,
      iconURL: ctx.author.avatarURL(),
    });
    embed.setTimestamp();

    const fields = [];
    let row = []; // Para almacenar los servidores en cada fila

    client.shoukaku.nodes.forEach((node, index) => {
      const statusIcon = node.stats ? "🟢" : "🔴";

      if (node.stats) {
        // Nodo activo: mostrar estadísticas detalladas
        const nodeStats = [
          `**Estado:** ${statusIcon}`,
          `**Conectados:** ${node.stats.players}`,
          `**Jugadores Reproduciendo:** ${node.stats.playingPlayers}`,
          `**Tiempo Activo:** ${client.utils.formatTime(node.stats.uptime)}`,
          `**Cores:** ${node.stats.cpu.cores} Core(s)`,
          `**Memoria:** ${client.utils.formatBytes(node.stats.memory.used)} / ${client.utils.formatBytes(node.stats.memory.reservable)}`,
          `**Carga del Sistema:** ${(Math.round(node.stats.cpu.systemLoad * 100) / 100).toFixed(2)}%`,
          `**Carga de Lavalink:** ${(Math.round(node.stats.cpu.lavalinkLoad * 100) / 100).toFixed(2)}%`,
        ];

        row.push({
          name: `🖥️ **${node.name}**`,
          value: nodeStats.join("\n"),
          inline: true,
        });
      } else {
        // Nodo inactivo: mensaje predeterminado
        row.push({
          name: `🖥️ **${node.name}**`,
          value: `**Estado:** ${statusIcon}\nNo hay estadísticas disponibles.`,
          inline: true,
        });
      }

      // Después de 2 servidores, agregamos la fila a los campos
      if ((index + 1) % 2 === 0 || index + 1 === client.shoukaku.nodes.length) {
        fields.push(...row);
        row = []; // Limpiar la fila para la siguiente
      }
    });

    embed.addFields(fields);

    return await ctx.sendMessage({ embeds: [embed] });
  }
};
