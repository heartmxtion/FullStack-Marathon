import mysql from 'mysql2';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const configPath = readFileSync(__dirname + '/config.json', 'utf8');
const config = JSON.parse(configPath);

const connection = mysql.createConnection(config)

export default connection;