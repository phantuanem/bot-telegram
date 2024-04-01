const { Telegraf, Markup } = require('telegraf')
const { message } = require('telegraf/filters')
require('dotenv').config()
const Task = require('../models/task')
const Member = require('../models/member')
const TelegramGroup = require('../models/telegram_group')
const GroupParticipant = require('../models/group_participant')
const TaskCatalog = require('../models/task_catalog')
const { where } = require('sequelize')
const { Sequelize } = require('sequelize')

const bot = new Telegraf(process.env.BOT_TOKEN)

const checkMember = async (message_from) => {
    console.log('------')
    console.log(message_from)
    const member = await Member.findOne({
        where: {
            member_id: message_from.id
        }
    })
    if (!member) {
        await Member.create({
            member_id: message_from.id,
            first_name: message_from.first_name,
            last_name: message_from.last_name,
            telegram_username: message_from.username
        })
    }
}

bot.start((ctx) => {
    console.log(ctx.update)
    return ctx.reply('Hello')
})
bot.help((ctx) => ctx.reply('Send me a sticker'))

bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.command('oldschool', (ctx) => ctx.reply('Hello kkk'))
bot.command('hipster', Telegraf.reply('λ test'))
bot.command('task', async (ctx) => {
    if (!ctx.update.message.from.is_bot) {
        const check_member = checkMember(ctx.update.message.from)
        if (ctx.update.message.chat.type !== 'group') {
            const list_task_catalog = await TaskCatalog.findAll({
                where: {
                    member_id: ctx.update.message.from.id
                },
                attributes: ['task_id', 'member_id']
            })
            var list_id_task = []
            for (let cata_log of list_task_catalog) {
                list_id_task.push(cata_log.task_id)
            }
            const list_task = await Task.findAll({
                where: {
                    task_id: {
                        [Sequelize.Op.notIn]: list_id_task
                    }
                },
                attributes: ['task_id', 'group_id', 'group_name', 'group_link']
            })
            const btns = []
            for (let task of list_task) {
                task.dataValues
                btns.push([{ text: task.group_name, callback_data: 'callbackTask_' + task.group_id }])
            }
            console.log(ctx.update.message)
            ctx.telegram.sendMessage(ctx.chat.id, 'All Task', {
                reply_markup: {
                    inline_keyboard: btns
                }
            })
        }
    }
    return
})

bot.command('tasksuccess', async (ctx) => {
    if (!ctx.update.message.from.is_bot) {
        const check_member = checkMember(ctx.update.message.from)
        if (ctx.update.message.chat.type !== 'group') {
            const list_task_catalog = await TaskCatalog.findAll({
                where: {
                    member_id: ctx.update.message.from.id
                },
                attributes: ['task_id', 'member_id']
            })
            var list_id_task = []
            for (let cata_log of list_task_catalog) {
                list_id_task.push(cata_log.task_id)
            }
            const list_task = await Task.findAll({
                where: {
                    task_id: list_id_task
                },
                attributes: ['task_id', 'group_id', 'group_name', 'group_link']
            })
            const btns = []
            for (let task of list_task) {
                task.dataValues
                btns.push([{ text: task.group_name, callback_data: 'btn' }])
            }
            console.log(ctx.update.message)
            ctx.telegram.sendMessage(ctx.chat.id, 'All Task Complete', {
                reply_markup: {
                    inline_keyboard: btns
                }
            })
        }
    }
    return
})

bot.command('members', async (ctx) => {
    try {
        console.log('command /members')
        console.log(ctx)
        const chatId = ctx.message.chat.id;

        // Sử dụng phương thức getChatMembersCount để lấy số lượng thành viên trong nhóm
        const membersCount = await ctx.telegram.getChatMembersCount(chatId);

        // Sử dụng phương thức getChatMembers để lấy thông tin về từng thành viên
        const members = await ctx.telegram.getChatMembers(chatId);

        // Hiển thị thông tin thành viên
        ctx.reply(`Số thành viên trong nhóm: ${membersCount}`);
        ctx.reply('Thông tin thành viên:');
        members.forEach((member) => {
            ctx.reply(`- ${member.user.username} (${member.user.id})`);
        });
    } catch (error) {
        console.error('Error:', error);
        ctx.reply('Đã xảy ra lỗi khi lấy thông tin thành viên của nhóm.');
    }
});

bot.action(/callbackTask_(.+)/, async (ctx) => {
    const callbackString = ctx.match[0];
    const group_id = callbackString.split("_")[1];
    const task = await Task.findOne({
        where: {
            group_id: group_id
        },
        attributes: ['task_id', 'group_id', 'group_name', 'group_link']
    })
    const btns = []
    btns.push([{ text: 'Join group ' + task.group_name, url: task.group_link }])
    btns.push([{ text: 'Done ' + task.group_name, callback_data: 'callbackDoneJoin_' + task.group_id + '~' + task.task_id }])
    ctx.telegram.sendMessage(ctx.chat.id, 'Join group', {
        reply_markup: {
            inline_keyboard: btns
        }
    })
});

bot.action(/callbackDoneJoin_(.+)/, async (ctx) => {
    console.log('test=======')
    const callbackString = ctx.match[0];
    const calbackData = callbackString.split("_")[1]
    const group_id = calbackData.split("~")[0];
    const task_id = calbackData.split("~")[1];
    console.log(ctx.update.callback_query.message.chat)
    const participant = await GroupParticipant.findOne({
        where: {
            telegram_group_id: group_id,
            participant_id: ctx.update.callback_query.message.chat.id
        }
    })
    if (participant) {
        const check_task_catalog = await TaskCatalog.findOne({
            where: {
                task_id: task_id,
                member_id: ctx.update.callback_query.message.chat.id
            }
        })
        if (!check_task_catalog) {
            await TaskCatalog.create({
                task_id: task_id,
                member_id: ctx.update.callback_query.message.chat.id
            })
        }
        return ctx.telegram.sendMessage(ctx.chat.id, 'Task completed')
    } else {
        return ctx.telegram.sendMessage(ctx.chat.id, 'Task Fail')
    }
});

bot.on('new_chat_members', async (ctx) => {
    if (ctx.message.new_chat_member.is_bot) {
        const check_telegram_group = await TelegramGroup.findOne({
            where: {
                telegram_group_id: ctx.message.chat.id
            }
        })
        if (!check_telegram_group) {
            await TelegramGroup.create({
                telegram_group_id: ctx.message.chat.id,
                telegram_group_name: ctx.message.chat.title
            })
        }
    } else {
        const check_participant = await GroupParticipant.findOne({
            where: {
                participant_id: ctx.message.new_chat_participant.id,
                telegram_group_id: ctx.message.chat.id
            }
        })
        if (!check_participant) {
            await GroupParticipant.create({
                participant_id: ctx.message.new_chat_participant.id,
                participant_username: ctx.message.new_chat_participant.username,
                telegram_group_id: ctx.message.chat.id
            })
        }
    }
    console.log('command new_chat_members')
    console.log('=========================')
    console.log(ctx.message)
    console.log('=========================')
    console.log(ctx)
})

module.exports = bot