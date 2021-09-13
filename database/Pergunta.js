const Sequelize = require('sequelize')
const connection = require('./database')

const Pergnta = connection.define('pergunta', { // -> cria a tabela
    //cria os campos da tabela
    titulo:{
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Pergnta.sync({force: false}).then(() =>{}) // sincroniza o model e cria a tabela

module.exports = Pergnta;