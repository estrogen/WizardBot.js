const { EmbedBuilder } = require('discord.js');
const orderHistory = require('../../models/shop/orderhistory');
const pendingOrders = require('../../models/shop/pendingOrders');
const moment = require("moment");

module.exports = {
    data: {
        name: 'confirmDegen'
    },
    async execute(i, bot) {
        await i.reply({ content: 'Fulfilling...', ephemeral: true })
        const log = await i.guild.channels.cache.get("890240568670716026");
        const embed = i.message.embeds[0];
        embed.data.title = `Buy order fulfilled by ${i.user.tag}`
        embed.data.color = 5763719
        const buyerMention = embed.fields.find(field => field.name === "Buyer").value;
        const buyerId = buyerMention.match(/<@(\d+)>/)[1];
        const itemName = embed.fields.find(field => field.name === "Item").value;

        try {
            await orderHistory.findOneAndUpdate(
                { guildID: i.guild.id, userID: buyerId },
                { 
                    $push: { history: { itemName: itemName, orderDate: moment(i.createdAt).unix() } },
                    $setOnInsert: { guildID: i.guild.id, userID: buyerId }
                },
                { upsert: true }
            );
            await pendingOrders.findOneAndUpdate(
                { guildID: i.guild.id, userID: buyerId },
                { $pull: { pending: { itemName: itemName } } } 
            );
            console.log("Order history updated successfully.");
        } catch (error) {
            console.error("Error updating order history:", error);
        }

        await log.send({ embeds: [embed]});
        if (i.channel.id !== "725883088281796698") i.message.delete();
    },
}