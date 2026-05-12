const { Sequelize } = require('sequelize')
const { existsSync } = require('fs')
const path = require('path')

const configPath = path.join(__dirname, './config.env')
const databasePath = path.join(__dirname, './database.db')

if (existsSync(configPath)) require('dotenv').config({ path: configPath })

const toBool = (x) => String(x).toLowerCase() === 'true'

// Database selection
const DATABASE_URL =
  process.env.DATABASE_URL === undefined ? databasePath : process.env.DATABASE_URL

module.exports = {
  // 🔥 BASIC INFO
  VERSION: require('./package.json').version,
  SESSION_ID: (process.env.SESSION_ID || '').trim(),

  // 🔥 DATABASE
  DATABASE:
    DATABASE_URL === databasePath
      ? new Sequelize({
          dialect: 'sqlite',
          storage: DATABASE_URL,
          logging: false,
          retry: { max: 10 },
          pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
          }
        })
      : new Sequelize(DATABASE_URL, {
          dialect: 'postgres',
          protocol: 'postgres',
          dialectOptions: {
            ssl: { require: true, rejectUnauthorized: false },
            keepAlive: true
          },
          logging: false,
          retry: { max: 10 }
        }),

  // 🔥 BOT BRANDING (ZAMAN-MD)
  PREFIX: (process.env.PREFIX || '^[.,!]').trim(),
  SUDO: process.env.SUDO || '',
  STICKER_PACKNAME: process.env.STICKER_PACKNAME || '❤️,Zaman-MD',

  // 🔥 SESSION / LOGIN CONTROL
  ALWAYS_ONLINE: toBool(process.env.ALWAYS_ONLINE || 'false'),
  FORCE_LOGOUT: toBool(process.env.FORCE_LOGOUT || 'false'),

  // 🔥 BOT STATUS
  LOG_MSG: toBool(process.env.LOG_MSG || 'false'),
  AUTO_STATUS_VIEW: toBool(process.env.AUTO_STATUS_VIEW || 'false'),
  SEND_READ: process.env.SEND_READ || 'false',

  // 🔥 SAFETY FEATURES
  ANTILINK_MSG: process.env.ANTILINK_MSG || '_Link removed by Zaman-MD_',
  ANTISPAM_MSG: process.env.ANTISPAM_MSG || '_Spam detected_',
  WARN_LIMIT: Number(process.env.WARN_LIMIT || 3),

  WARN_MESSAGE:
    process.env.WARN_MESSAGE ||
    '⚠️ WARNING ⚠️\nUser: &mention\nWarn: &warn\nRemaining: &remaining',

  WARN_RESET_MESSAGE:
    process.env.WARN_RESET_MESSAGE ||
    'WARN RESET\nUser: &mention\nRemaining: &remaining',

  WARN_KICK_MESSAGE: process.env.WARN_KICK_MESSAGE || '&mention kicked',

  // 🔥 AI / GPT
  GPT: (process.env.GPT || 'free').trim(),
  MODEL: (process.env.MODEL || 'gpt-3.5-turbo').trim(),

  GEMINI_API_KEY: (process.env.GEMINI_API_KEY || '').trim(),
  GEMINI_MODEL: (process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim(),

  GROQ_API_KEY: (process.env.GROQ_API_KEY || '').trim(),
  GROQ_MODEL: (process.env.GROQ_MODEL || 'llama-3.3-70b-versatile').trim(),

  // 🔥 BOT SYSTEM
  ANTI_DELETE: (process.env.ANTI_DELETE || 'false').trim(),
  ANTI_BOT: (process.env.ANTI_BOT || 'off').trim(),

  // 🔥 HOSTING FLAGS
  VPS: toBool(process.env.VPS || 'false'),
  KOYEB: toBool(process.env.KOYEB || 'false'),

  // 🔥 EXTRA
  BOT_LANG: process.env.BOT_LANG || 'en',
  TIMEZONE: process.env.TIMEZONE || 'Asia/Karachi'
  }
