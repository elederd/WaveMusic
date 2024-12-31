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
      "\n"
    );
    embed.setFooter({
      text: `Solicitado por ${ctx.author.username}`,
      iconURL: ctx.author.avatarURL(),
    });
    embed.setTimestamp();

    client.shoukaku.nodes.forEach((node) => {
      const statusIcon = node.stats ? "🟢" : "🔴";

      if (node.stats) {
        // Nodo activo: mostrar estadísticas detalladas
      const fields = [
        `**Estado:** ${statusIcon}`,
        `**Conectados:** ${node.stats ? node.stats.players : "N/A"}`,
        `**Reproduciendo:** ${node.stats ? node.stats.playingPlayers : "N/A"}`,
        `**Activo:** ${node.stats ? client.utils.formatTime(node.stats.uptime) : "N/A"}`,
        `**Cores:** ${node.stats ? node.stats.cpu.cores : "N/A"} Core(s)`,
        `**Memoria:** ${node.stats ? client.utils.formatBytes(node.stats.memory.used) : "N/A"} / ${node.stats ? client.utils.formatBytes(node.stats.memory.reservable) : "N/A"}`,
        `**Sistema:** ${node.stats ? (Math.round(node.stats.cpu.systemLoad * 100) / 100).toFixed(2) : "N/A"}%`,
        `**Lavalink:** ${node.stats ? (Math.round(node.stats.cpu.lavalinkLoad * 100) / 100).toFixed(2) : "N/A"}%`,
      ];

        embed.addFields([
          {
            name: `🖥️ **${node.name}**`,
            value: fields.join("\n"),
            inline: true,
          },
        ]);
      } else {
        // Nodo inactivo: mensaje predeterminado
        embed.addFields([
          {
            name: `🖥️ **${node.name}**`,
            value: `**Estado:** ${statusIcon}\nNo hay estadísticas disponibles.`,
            inline: true,
          },
        ]);
      }
    });

    return await ctx.sendMessage({ embeds: [embed] });
  }
};             
