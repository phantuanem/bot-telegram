const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('./sequelize')
const TaskCatalog = require('./task_catalog')

var Task = sequelize.define('task', {
    task_id: DataTypes.INTEGER,
    group_id: DataTypes.BIGINT,
    group_name: DataTypes.STRING,
    group_link: DataTypes.STRING
}, {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
})
Task.removeAttribute('id')
Task.belongsTo(TaskCatalog, { foreignKey: 'task_id', targetKey: 'task_id' });

module.exports = Task