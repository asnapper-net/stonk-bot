import axios from 'axios'
import { ChartConfiguration } from 'chart.js'
import { ChartJSNodeCanvas } from 'chartjs-node-canvas'

export const getConfiguration = (data: Array<any>, symbol: string): ChartConfiguration => {

    return {
        type: 'line',
        data: {
            // labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
            datasets: [{
                label: symbol,
                data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    // 'rgba(54, 162, 235, 0.2)',
                    // 'rgba(255, 206, 86, 0.2)',
                    // 'rgba(75, 192, 192, 0.2)',
                    // 'rgba(153, 102, 255, 0.2)',
                    // 'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    // 'rgba(54, 162, 235, 1)',
                    // 'rgba(255, 206, 86, 1)',
                    // 'rgba(75, 192, 192, 1)',
                    // 'rgba(153, 102, 255, 1)',
                    // 'rgba(255, 159, 64, 1)'
                ],
                // borderColor: 'blue',
                borderWidth: 1,
                // backgroundColor: 'fuchsia',
                pointStyle: 'line',
                cubicInterpolationMode:'monotone',
                
            }]
        },
        options: {
        defaultColor: 'white',

            scales: {
                yAxes: [{
                    // type: 'time',
                    gridLines: {
                        color: 'rgba(255, 99, 132, 0.2)',
                        // z: 1
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
                    // z: 1
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
    console.debug({canvasRenderService})

    return await canvasRenderService.renderToBuffer(getConfiguration(data, symbol))
}

export const getChartUrl = (symbol: string) => `https://api.nasdaq.com/api/quote/${symbol.toUpperCase()}/chart?assetClass=stocks&charttype=real`

export const fetchChartData = async (symbol: string) => {
    // try {
        const { data: responseData } = await axios.get(getChartUrl(symbol), {
            responseType: 'json'
        })

        const { chart } = responseData.data
        console.debug({symbol,responseData})

        const buffer = await mkChart(chart.map((d: any) => ({ ...d, x: new Date(d.x) })), symbol)
        console.debug({buffer})

        return buffer
        // fs.writeFileSync("test.png", buffer,  "binary");
    // } catch (e) {
    //     console.log(e)
    // }

}
