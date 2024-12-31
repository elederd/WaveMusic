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

    let nodeList1 = [];
    let nodeList2 = [];

    // Divide los nodos en dos listas de servidores
    client.shoukaku.nodes.forEach((node, index) => {
      const nodeStats = `
        **Name**: ${node.name} (${node.stats ? "🟢" : "🔴"})\n
        **Players**: ${node.stats.players}\n
        **Playing Players**: ${node.stats.playingPlayers}\n
        **Uptime**: ${client.utils.formatTime(node.stats.uptime)}\n
        **Cores**: ${node.stats.cpu.cores} Core(s)\n
        **Memory Usage**: ${client.utils.formatBytes(node.stats.memory.used)}/${client.utils.formatBytes(node.stats.memory.reservable)}\n
        **System Load**: ${(Math.round(node.stats.cpu.systemLoad * 100) / 100).toFixed(2)}%\n
        **Lavalink Load**: ${(Math.round(node.stats.cpu.lavalinkLoad * 100) / 100).toFixed(2)}%
      `;

      // Dividir nodos en dos listas
      if (index < 6) {
        nodeList1.push(nodeStats);
      } else {
        nodeList2.push(nodeStats);
      }
    });

    // Añadir las listas al embed
    embed.addFields({
      name: "Servers 1-6",
      value: nodeList1.join("\n\n"),
    });
    embed.addFields({
      name: "Servers 7-12",
      value: nodeList2.join("\n\n"),
    });

    return await ctx.sendMessage({ embeds: [embed] });
  }
};
