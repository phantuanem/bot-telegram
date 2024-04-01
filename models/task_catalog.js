const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('./sequelize')

var TaskCatalog = sequelize.define('task_catalog', {
    task_id: DataTypes.INTEGER,
    member_id: DataTypes.BIGINT
}, {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
})

TaskCatalog.removeAttribute('id')

module.exports = TaskCatalog