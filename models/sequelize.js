const {Sequelize} = require('sequelize')

var sequelize = new Sequelize('shop1','postgres', 'tuanem', {
    host: 'localhost',
    dialect: 'postgres'
});

module.exports = sequelize