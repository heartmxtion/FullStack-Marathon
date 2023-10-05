const mysql = require('mysql2')
const configPath = require.resolve('./config.json');
const readConfig = require('read-config')
const config = readConfig(configPath)
const connection = mysql.createConnection(config)

module.exports = connection