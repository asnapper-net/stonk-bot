import { connect } from 'amqplib'

export const getRabbitSender = async (queue: string, url: string) => {
    const connection = await connect(url)
    const channel = await connection.createChannel()

    return async (payload: any) => {
        await channel.assertQueue(queue)
        return await channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)))
    }
}
