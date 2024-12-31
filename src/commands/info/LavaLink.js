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
    embed.setTitle("🌐 Lavalink Status")
      .setColor(this.client.color.main)
      .setThumbnail(this.client.user.avatarURL({}))
      .setDescription(
        "Aquí están las estadísticas actuales de los nodos Lavalink que están en uso.\n" +
        "🟢 = Activo | 🔴 = Inactivo"
      )
      .setFooter({
        text: `Solicitado por ${ctx.author.username}`,
        iconURL: ctx.author.avatarURL(),
      })
      .setTimestamp();

    client.shoukaku.nodes.forEach((node) => {
      const statusIcon = node.stats ? "🟢" : "🔴";

      embed.addFields([
        {
          name: `🖥️ **${node.name}**`,
          value: node.stats
            ? [
                `**Estado:** ${statusIcon}`,
                `**Conectados:** ${node.stats.players}`,
                `**Jugadores Reproduciendo:** ${node.stats.playingPlayers}`,
                `**Memoria:** ${client.utils.formatBytes(node.stats.memory.used)} / ${client.utils.formatBytes(node.stats.memory.reservable)}`,
                `**Cores:** ${node.stats.cpu.cores}`,
                `**Carga del Sistema:** ${(node.stats.cpu.systemLoad * 100).toFixed(2)}%`,
                `**Carga de Lavalink:** ${(node.stats.cpu.lavalinkLoad * 100).toFixed(2)}%`,
              ].join("\n")
            : `**Estado:** ${statusIcon}\nNo hay estadísticas disponibles.`,
          inline: false, // Cambia esto a "true" si quieres que los campos estén uno al lado del otro
        },
      ]);
    });

    return await ctx.sendMessage({ embeds: [embed] });
  }
};
