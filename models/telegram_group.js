const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('./sequelize')
const { telegram } = require('../src/telegram')

var TelegramGroup = sequelize.define('telegram_group', {
    telegram_group_id: DataTypes.BIGINT,
    telegram_group_name: DataTypes.STRING
}, {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
})

TelegramGroup.removeAttribute('id')

module.exports = TelegramGroup