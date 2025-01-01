const Command = require("../../structures/Command.js");
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { Dynamic } = require("musicard");
const fs = require("fs");
const path = require("path");

module.exports = class Nowplaying extends Command {
  constructor(client) {
    super(client, {
      name: "nowplaying",
      description: {
        content: "Shows the currently playing song",
        examples: ["nowplaying"],
        usage: "nowplaying",
      },
      category: "music",
      aliases: ["np"],
      cooldown: 3,
      args: false,
      player: {
        voice: true,
        dj: false,
        active: true,
        djPerm: null,
      },
      permissions: {
        dev: false,
        client: ["SendMessages", "ViewChannel", "EmbedLinks"],
        user: [],
      },
      slashCommand: true,
      options: [],
    });
  }

  async run(client, ctx) {
    const player = client.queue.get(ctx.guild.id);
    const track = player.current;

    // Generate music card with Dynamic
    try {
      const musicard = await Dynamic({
        thumbnailImage: track.info.thumbnail || 'https://example.com/default_thumbnail.png',
        backgroundColor: '#070707',
        progress: 10,
        progressColor: '#FF7A00',
        progressBarColor: '#5F2D00',
        name: track.info.title,
        nameColor: '#FF7A00',
        author: track.info.author || 'Unknown Artist',
        authorColor: '#696969',
      });

      // Save the generated card to a file
      const cardPath = path.join(__dirname, 'musicard.png');
      fs.writeFileSync(cardPath, musicard);

      // Prepare the attachment and embed
      const attachment = new AttachmentBuilder(cardPath, { name: 'musicard.png' });
      const embed1 = new EmbedBuilder()
        .setColor('#FF7A00')
        .setAuthor({ name: "Now Playing", iconURL: ctx.guild.iconURL({}) })
        .setDescription(`[${track.info.title}](${track.info.uri}) - Requested By: ${track.info.requester}`)
        .setImage('attachment://musicard.png')
        .setFooter({ text: `Duration: ${client.utils.formatTime(track.info.length)}` });

      // Send the embed and attachment
      return await ctx.sendMessage({ embeds: [embed1], files: [attachment] });
    } catch (error) {
      console.error("Error creating music card:", error);
      const embedError = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription("⚠️ **Unable to generate music card.**");
      return await ctx.sendMessage({ embeds: [embedError] });
    }
  }
};
