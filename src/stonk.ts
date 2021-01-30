import axios from 'axios'
import { ChartConfiguration } from 'chart.js'
import { ChartJSNodeCanvas } from 'chartjs-node-canvas'
import { get } from './decoy'

export const getConfiguration = (data: Array<any>, symbol: string): ChartConfiguration => {

    return {
        type: 'line',
        data: {
            datasets: [{
                label: symbol,
                data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)'
                ],
                borderWidth: 1,
                pointStyle: 'line',
                cubicInterpolationMode: 'monotone',

            }]
        },
        options: {
            defaultColor: 'white',

            scales: {
                yAxes: [{
                    gridLines: {
                        color: 'rgba(255, 99, 132, 0.2)',
                    },
                }],
                xAxes: [{
                    type: 'time',
                    time: {
                        displayFormats: {
                            quarter: 'MMM YYYY'
                        }
                    },
                    gridLines: {
                        color: 'rgba(255, 99, 132, 0.2)',
                    },

                    distribution: 'series',
                    ticks: {
                        major: {
                            enabled: true,
                        },
                        source: 'data',
                        maxRotation: 0,
                        autoSkip: true,
                        autoSkipPadding: 75,
                        sampleSize: 10
                    },
                }]
            }
        }
    }
}

const mkChart = async (data: Array<any>, symbol: string) => {
    const canvasRenderService = new ChartJSNodeCanvas({
        width: 400,
        height: 400
    })

    console.debug({ canvasRenderService })

    return await canvasRenderService.renderToBuffer(getConfiguration(data, symbol), 'image/png')
}

export const getChartUrl = (symbol: string) => `https://api.nasdaq.com/api/quote/${symbol.toUpperCase()}/chart?assetClass=stocks&charttype=real`

export const fetchChartData = async (symbol: string) => {
    console.debug({ symbol })

    const url = getChartUrl(symbol)
    console.debug({ url })

    const responseData = await get(url)
    console.debug({ responseData })

    const { chart } = responseData.data
    console.debug({ symbol, responseData })

    const buffer = await mkChart(chart.map((d: any) => ({ ...d, x: new Date(d.x) })), symbol)
    console.debug({ buffer })

    return buffer

}
