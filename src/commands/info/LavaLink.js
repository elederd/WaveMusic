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

    let activeNodes = [];
    let inactiveNodes = [];

    client.shoukaku.nodes.forEach((node) => {
      const statusIcon = node.stats ? "🟢" : "🔴";
      const fields = [
        `**Estado:** ${statusIcon}`,
        `**Conectados:** ${node.stats ? node.stats.players : "N/A"}`,
        `**Jugadores Reproduciendo:** ${node.stats ? node.stats.playingPlayers : "N/A"}`,
        `**Tiempo Activo:** ${node.stats ? client.utils.formatTime(node.stats.uptime) : "N/A"}`,
        `**Cores:** ${node.stats ? node.stats.cpu.cores : "N/A"} Core(s)`,
        `**Memoria:** ${node.stats ? client.utils.formatBytes(node.stats.memory.used) : "N/A"} / ${node.stats ? client.utils.formatBytes(node.stats.memory.reservable) : "N/A"}`,
        `**Carga del Sistema:** ${node.stats ? (Math.round(node.stats.cpu.systemLoad * 100) / 100).toFixed(2) : "N/A"}%`,
        `**Carga de Lavalink:** ${node.stats ? (Math.round(node.stats.cpu.lavalinkLoad * 100) / 100).toFixed(2) : "N/A"}%`,
      ];

      const field = {
        name: `🖥️ **${node.name}**`,
        value: fields.join("\n"),
        inline: true,
      };

      if (node.stats) {
        activeNodes.push(field);
      } else {
        inactiveNodes.push(field);
      }
    });

    // Dividir los nodos en bloques de 3
    while (activeNodes.length > 0) {
      embed.addFields(activeNodes.splice(0, 2));
    }

    // Agregar nodos inactivos si es necesario
    if (inactiveNodes.length > 0) {
      embed.addFields(inactiveNodes);
    }

    embed.setWidth("800");  // Asegúrate de que este campo funcione según tu implementación

    return await ctx.sendMessage({ embeds: [embed] });
  }
};
