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
    embed.setTitle("Lavalink Status");
    embed.setColor(this.client.color.main);
    embed.setThumbnail(this.client.user.avatarURL({}));
    embed.setDescription("\n");
    embed.setFooter({
      text: `Solicitado por ${ctx.author.username}`,
      iconURL: ctx.author.avatarURL(),
    });
    embed.setTimestamp();

    client.shoukaku.nodes.forEach((node) => {
      const statusIcon = node.connected ? "🟢" : "🔴";

      if (node.connected && node.stats) {
        // Nodo activo: mostrar estadísticas detalladas
        const fields = [
          `**Estado:** ${statusIcon}`,
          `**Conectados:** ${node.stats.players}`,
          `**Reproduciendo:** ${node.stats.playingPlayers}`,
          `**Activo:** ${client.utils.formatTime(node.stats.uptime)}`,
          `**Cores:** ${node.stats.cpu.cores} Core(s)`,
          `**Memoria:** ${client.utils.formatBytes(node.stats.memory.used)} / ${client.utils.formatBytes(node.stats.memory.reservable)}`,
          `**Sistema:** ${(Math.round(node.stats.cpu.systemLoad * 100) / 100).toFixed(2)}%`,
          `**Lavalink:** ${(Math.round(node.stats.cpu.lavalinkLoad * 100) / 100).toFixed(2)}%`,
        ];

        embed.addFields([
          {
            name: `🖥️ **${node.name}**`,
            value: fields.join("\n"),
            inline: true,
          },
        ]);
      } else {
        // Nodo inactivo o desconectado
        embed.addFields([
          {
            name: `🖥️ **${node.name}**`,
            value: `**Estado:** ${statusIcon}\nServer no disponible.`,
            inline: true,
          },
        ]);
      }
    });

    return await ctx.sendMessage({ embeds: [embed] });
  }
};
