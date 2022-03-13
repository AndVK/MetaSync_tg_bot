require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');
const CoinGecko = require('coingecko-api');

const token = process.env.TOKEN;
const bot = new TelegramBot(token, {polling: true});
const CoinGeckoClient = new CoinGecko();

const getCryptoPrice = async(crypto) => {
  let data = await CoinGeckoClient.coins.fetch(crypto, {
    tickers: false,
    community_data: false,
    developer_data: false,
    localization: false,
  });
  return data.data.market_data.current_price.usd
};

const keyboard = [
  [{text: 'Bitcoin (BTC)', callback_data: 'bitcoin'}],
  [{text: 'Ethereum (ETH)', callback_data: 'ethereum'}],
  [{text: 'Tether (USDT)', callback_data: 'tether'}],
];

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Hello, friend! What cryptocurrency rate are you interested in?', {
        reply_markup: {
            inline_keyboard: keyboard
        }
    });
});

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  let coin = query.data
  let result = '';

  console.log('USER ===>', query.from.username, new Date());

  switch (coin) {
    case 'bitcoin':{
      result = await getCryptoPrice(coin);
      const current = `Bitcoin (BTC) -${result}$ \nClick again!`
      bot.sendMessage(chatId, current, {
        reply_markup: {
            inline_keyboard: keyboard
        }});
      break;
    }

    case 'ethereum':{
      result = await getCryptoPrice(coin);
      const current = `Ethereum (ETH) -${result}$ \nClick again!`
      bot.sendMessage(chatId, current, {
        reply_markup: {
            inline_keyboard: keyboard
      }});
      break;
    }

    case 'tether':{
      result = await getCryptoPrice(coin);
      const current = `Tether (USDT) -${result}$ \nClick again!`
      bot.sendMessage(chatId, current, {
        reply_markup: {
            inline_keyboard: keyboard
        }});
      break;
    }
      
    default:
      break;
  }
});
