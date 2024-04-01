const express = require('express')
const bot = require('./src/telegram.js')
require('dotenv').config()

bot.launch()

const app = express()

app.listen(3000)
