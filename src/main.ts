import express from 'express'
import TelegramBot from 'node-telegram-bot-api'
import { AddressInfo } from 'net'
import { getRabbitSender } from './rabbit'
import { fetchChartData } from './stonk'

const { PORT, BOT_TOKEN, BOT_WEBHOOK_BASE_URL, RABBIT_QUEUE, RABBIT_URL } = process.env

console.info({ PORT, BOT_TOKEN, BOT_WEBHOOK_BASE_URL, RABBIT_QUEUE, RABBIT_URL })

const app = express()

const server = app.listen(PORT || 3000, async () => {
    const addr = server.address() as AddressInfo
    console.log(`listening on ${addr.address}:${addr.port} [${addr.family}]`)
    main()
})

async function main() {

    

    const bot = new TelegramBot(BOT_TOKEN as string)

    // const send = await getRabbitSender(RABBIT_QUEUE as string, RABBIT_URL as string)

    if (BOT_WEBHOOK_BASE_URL) {
        app.use(express.json())

        const path = '/' + BOT_TOKEN

        console.info({ path })

        app.post(path, (req, _) => {
            bot.processUpdate(req.body)
        })

        const url = BOT_WEBHOOK_BASE_URL.replace(/\/$/, '') + path

        console.info({ url })

        bot.setWebHook(url)

    } else {
        bot.startPolling()
    }

    bot.on('message', async (message, metadata) => {
        console.debug({ message, metadata })

        
        if (message.text) {
            try {
    
                const matches = message.text.match(/\$([A-Za-z]+)/)
                if (matches?.length && matches?.length > 1) {
                    const symbol = matches[1]
                    const bla = await fetchChartData(symbol)
    
                    if (bla) {
                        await bot.sendPhoto(message.chat.id, bla as Buffer)
                    }
    
                }
            } catch(e) {
                bot.sendMessage(message.chat.id, 'shut up B')
            }
        }

        // send({ message, metadata, token: BOT_TOKEN })
    })

}