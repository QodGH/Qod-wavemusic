const { MessageEmbed, MessageActionRow, MessageButton, CommandInteraction, Client } = require("discord.js");

module.exports = {
    name: "party",
    description: "Sets Party Filter.",
    owner: false,

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    run: async (client, interaction, prefix) => {

        await interaction.deferReply({
            ephemeral: false
          });

        const player = interaction.client.manager.get(interaction.guild.id);
    if (!player.queue.current) {
      let thing = new MessageEmbed()
        .setColor("RED")
        .setDescription("There is no music playing.");
      return interaction.editReply({ embeds: [thing] });
    }
    const emojiequalizer = interaction.client.emoji.filter;
    const embed = new MessageEmbed()
      .setColor(client.embedColor)
      .setDescription(`Chose The Buttons`);

    const but = new MessageButton()
      .setCustomId("clear_but")
      .setLabel("OFF")
      .setStyle("DANGER");
    const but2 = new MessageButton()
      .setCustomId("Party_but")
      .setLabel("ON")
      .setStyle("PRIMARY");

    const but_ = new MessageButton()
      .setCustomId("clear_but_")
      .setLabel("OFF")
      .setStyle("DANGER")
      .setDisabled(true);
    const but_2 = new MessageButton()
      .setCustomId("Party_but_")
      .setLabel("ON")
      .setStyle("PRIMARY")
      .setDisabled(true);

    const row1 = new MessageActionRow().addComponents(but, but_2);
    const row2 = new MessageActionRow().addComponents(but2, but_);
    const row3 = new MessageActionRow().addComponents(but2, but_);

    const m = await interaction.editReply({ embeds: [embed], components: [row3] });

    const embed1 = new MessageEmbed().setColor(client.embedColor);
    const collector = m.createMessageComponentCollector({
      filter: (f) =>
        f.user.id === interaction.member.user.id
          ? true
          : false && f.deferUpdate().catch(() => {}),
      time: 60000,
      idle: 60000 / 2,
    });
    collector.on("end", async () => {
      if (!m) return;
      await m.edit({
        embeds: [embed1.setDescription(`Time is Out type again ${prefix}party`)],
        components: [
          new MessageActionRow().addComponents(
            but2.setDisabled(true),
            but.setDisabled(true)
          ),
        ],
      });
    });
    collector.on("collect", async (b) => {
      if (!b.replied) await b.deferUpdate({ ephemeral: true });
      if (b.customId === "clear_but") {
        await player.clearEffects();
        return await b.editReply({
          embeds: [
            embed1.setDescription(`${emojiequalizer} Party Mode Is \`OFF\``),
          ],
          components: [row2],
        });
      } else if (b.customId === "8D_but") {
        var bands = [
            { band: 0, gain: -1.16 },
            { band: 1, gain: 0.28 },
            { band: 2, gain: 0.42 },
            { band: 3, gain: 0.5 },
            { band: 4, gain: 0.36 },
            { band: 5, gain: 0 },
            { band: 6, gain: -0.3 },
            { band: 7, gain: -0.21 },
            { band: 8, gain: -0.21 },
          ];
          await player.setEQ(...bands);
        return await b.editReply({
          embeds: [
            embed1.setDescription(`${emojiequalizer} Party Mode Is \`ON\``),
          ],
          components: [row1],
        });
      }
    });
  },
};