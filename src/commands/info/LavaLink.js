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

        fields.push({
          name: `🖥️ **${node.name}**`,
          value: nodeStats.join("\n"),
          inline: true,
        });
      } else {
        // Nodo inactivo: mensaje predeterminado
        fields.push({
          name: `🖥️ **${node.name}**`,
          value: `**Estado:** ${statusIcon}\nNo hay estadísticas disponibles.`,
          inline: true,
        });
      }
      
      // Cada 2 nodos, se agrega una línea vacía para separar las columnas
      if ((index + 1) % 2 === 0 && index + 1 < client.shoukaku.nodes.length) {
        fields.push({
          name: '\u200B', // Un espacio vacío para separar columnas
          value: '\u200B',
          inline: true,
        });
      }
    });

    embed.addFields(fields);

    return await ctx.sendMessage({ embeds: [embed] });
  }
};
