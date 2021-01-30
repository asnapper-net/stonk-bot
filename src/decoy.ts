import { Builder, Capabilities } from "selenium-webdriver"

const getRemoteDriver = () => {
    return new Builder()
        .usingServer(process.env.SELENIUM_URL || "http://localhost:4444/wd/hub")
        .withCapabilities(Capabilities.chrome())
        .build()
}

export const get = async (url: string, retires: number = 5) => {
    const driver = getRemoteDriver()

    await driver.get(url)
    const result = await (await driver).findElement({
        tagName: 'pre'
    })
    const body = JSON.parse(await result.getText())

    await (await driver).quit()

    return body
}

