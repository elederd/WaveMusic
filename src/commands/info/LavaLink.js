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

    let serverFields = [];

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
        `**Carga de Lavalink:** ${node.stats ? (Math.round(node.stats.cpu.lavalinkLoad * 100) / 100).toFixed(2) : "N/A"}%`
      ];

      serverFields.push({
        name: `🖥️ **${node.name}**`,
        value: fields.join("\n"),
        inline: true,
      });
    });

    // Dividir los servidores en 2 columnas y 3 filas
    const rows = [];
    while (serverFields.length > 0) {
      rows.push(serverFields.splice(0, 2));  // Extrae 2 elementos (servidores) por fila
    }

    // Añadir las filas al embed
    rows.forEach((row) => {
      embed.addFields(row);  // Esto agrega una fila con 2 servidores
    });

    return await ctx.sendMessage({ embeds: [embed] });
  }
};
