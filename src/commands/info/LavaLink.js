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
      "Aquí están las estadísticas actuales de los nodos Lavalink que están en uso.\n" +
        "🟢 = Activo | 🔴 = Inactivo"
    );
    embed.setFooter({
      text: `Solicitado por ${ctx.author.username}`,
      iconURL: ctx.author.avatarURL(),
    });
    embed.setTimestamp();

    const nodes = Array.from(client.shoukaku.nodes.values()).slice(0, 3); // Limitar a los 3 primeros nodos

    nodes.forEach((node) => {
      const statusIcon = node.stats ? "🟢" : "🔴";

      if (node.stats) {
        // Nodo activo: mostrar estadísticas detalladas
        const fields = [
          `**Estado:** ${statusIcon}`,
          `**Conectados:** ${node.stats.players}`,
          `**Jugadores Reproduciendo:** ${node.stats.playingPlayers}`,
          `**Tiempo Activo:** ${client.utils.formatTime(node.stats.uptime)}`,
          `**Cores:** ${node.stats.cpu.cores} Core(s)`,
          `**Memoria:** ${client.utils.formatBytes(node.stats.memory.used)} / ${client.utils.formatBytes(node.stats.memory.reservable)}`,
          `**Carga del Sistema:** ${(Math.round(node.stats.cpu.systemLoad * 100) / 100).toFixed(2)}%`,
          `**Carga de Lavalink:** ${(Math.round(node.stats.cpu.lavalinkLoad * 100) / 100).toFixed(2)}%`,
        ];

        embed.addFields([
          {
            name: `🖥️ **${node.name}**`,
            value: fields.join("\n"),
            inline: false, // Hacer el embed más ancho
          },
        ]);
      } else {
        // Nodo inactivo: mensaje predeterminado
        embed.addFields([
          {
            name: `🖥️ **${node.name}**`,
            value: `**Estado:** ${statusIcon}\nNo hay estadísticas disponibles.`,
            inline: false, // Hacer el embed más ancho
          },
        ]);
      }
    });

    return await ctx.sendMessage({ embeds: [embed] });
  }
};
