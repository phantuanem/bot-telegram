const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('./sequelize')
const { telegram } = require('../src/telegram')

var GroupParticipant = sequelize.define('group_participant', {
    participant_id: DataTypes.BIGINT,
    participant_username: DataTypes.STRING,
    telegram_group_id: DataTypes.BIGINT
}, {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
})

module.exports = GroupParticipant