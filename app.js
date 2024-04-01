const express = require('express')
const bot = require('./src/telegram.js')
require('dotenv').config()
const path = require('path')

bot.launch()

const app = express()
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000)