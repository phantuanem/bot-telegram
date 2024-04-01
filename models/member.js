const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('./sequelize')

var Member = sequelize.define('member', {
    member_id: DataTypes.BIGINT,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    telegram_username: DataTypes.STRING,
    discord_id: DataTypes.STRING
}, {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
})

Member.removeAttribute('id')

module.exports = Member