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
    embed.setTitle("Lavalink Stats");
    embed.setColor(this.client.color.main);
    embed.setThumbnail(this.client.user.avatarURL({}));
    embed.setTimestamp();

    client.shoukaku.nodes.forEach((node) => {
      try {
        // Agrupamos todos los datos de cada servidor en un solo objeto `fields`.
        embed.addFields([
          {
            name: `**${node.name} (${node.stats ? "🟢" : "🔴"})**`,
            value: [
              `**Player:** ${node.stats.players}`,
              `**Playing Players:** ${node.stats.playingPlayers}`,
              `**Uptime:** ${client.utils.formatTime(node.stats.uptime)}`,
              `**Cores:** ${node.stats.cpu.cores} Core(s)`,
              `**Memory Usage:** ${client.utils.formatBytes(
                node.stats.memory.used
              )} / ${client.utils.formatBytes(node.stats.memory.reservable)}`,
              `**System Load:** ${(Math.round(
                node.stats.cpu.systemLoad * 100
              ) / 100).toFixed(2)}%`,
              `**Lavalink Load:** ${(Math.round(
                node.stats.cpu.lavalinkLoad * 100
              ) / 100).toFixed(2)}%`,
            ].join("\n"),
            inline: true, // Hacemos que el campo sea inline para mostrar varios lado a lado.
          },
        ]);
      } catch (e) {
        console.log(e);
      }
    });

    return await ctx.sendMessage({ embeds: [embed] });
  }
};
