const { SimpleResponse, Carousel, Image } = require('dialogflow-fulfillment/node_modules/actions-on-google/dist/service/actionssdk');

const processor = require('./processor')
const express = require('express'),
    bodyParser = require('body-parser')
const { WebhookClient } = require('dialogflow-fulfillment')
const { Card, Suggestion } = require('dialogflow-fulfillment')

const https = require('./synchttps')

const PORT = process.env.PORT || 4200


const app = express(bodyParser.json())

app.use(bodyParser.json())

app.get('/', async (request, response) => {
    let retJSON = await https.getJSON({
            host: '110.49.202.87',
            port: 8443,
            path: '/GoogleAssistant/GetMainMenu',
            method: 'GET',
            rejectUnauthorized: false,
            agent: false,
     })
    response.send(retJSON.menu.packages.packageList[0])
    response.end()
})
  
app.get('/Hello', async (request, response) => {
    let retJSON = await https.getJSON({
        host: '110.49.202.87',
        port: 8443,
        path: '/GoogleAssistant/GetCurrentBalacnce/66932780014',
        method: 'GET',
        rejectUnauthorized: false,
        agent: false,
    })
    response.send(retJSON)
    response.end()
})

app.get('/top-seller', async (request, response) => {
    await https.get({
        host: '110.49.202.87',
        port: 8443,
        path: '/GoogleAssistant/GetMainMenu',
        method: 'GET',
        rejectUnauthorized: false,
        agent: false,
    }, (res) => {
        let data = ''

        res.on('data', (x) => {data += x})

        res.on('end', () => {
            response.send(JSON.parse(data))
            response.end()
        })
    }).on('error', (e) => {
        console.log(e)
        response.send({error: e})
    })
})

app.post('/', (req, res) => {
    console.log("Request Header: " + JSON.stringify(req.headers))
    console.log("Request Body: " + JSON.stringify(req.body))

    req = processor(req)

    const agent = new WebhookClient({request: req, response: res})

    function welcome(agent) {
        agent.add(`สวัสดีครับ มีอะไรให้อุ่นใจช่วยครับ`)
    }

    function fallback(agent) {
        agent.add(`I don't understand`)
        agent.add(`I am sorry. Can you repeat again`)
    }

    function sim2fly(agent) {
        const simImg = [
            'https://store.ais.co.th/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/1/2/12call_sim2fly_399_b_1.jpg',
            'https://store.ais.co.th/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/1/2/12call_sim2fly_899_b.jpg',
            'https://store.ais.co.th/media/catalog/product/cache/2/image/320x/040ec09b1e35df139433887a97daa66f/s/i/sim_marathon850_3.jpg'
        ]

        let conv = agent.conv()
        conv.ask(new SimpleResponse({
            speech: '<speak>อุ่นใจแนะนำ Sim<sub alias="ทู">2</sub>Fly ราคาประหยัดครับ</speak>',
            text: 'อุ่นใจแนะนำ Sim2Fly ราคาประหยัดครับ ✈️'
        }))
        conv.ask(new Carousel({
            items: {
                'Select_399': {
                    title: `Sim 2 Fly 399`,
                    description: `เอเชีย, ออสเตรเลีย 🗼`,
                    image: new Image({
                        url: simImg[0], alt: 'Sim2Fly 399'
                    })
                },
                'Select_899': {
                    title: `Sim 2 Fly 899`,
                    description: "ยุโรป อเมริกา และอื่น 🌎",
                    image: new Image({
                        url: simImg[1], alt: 'Sim2Fly 899'
                    })
                },
                'Select_600': {
                    title: `ซิม เน็ต มาราธอน 600`,
                    description: "ซิม เน็ต มาราธอน 600 บาท (เน็ตไม่อั้นเร็ว 1 Mbps นาน 6 เดือน)",
                    image: new Image({
                        url: simImg[2], alt: 'ซิม เน็ต มาราธอน 600'
                    })
                }
            }
        }))
        agent.add(conv)
    }
    
    async function bestSellerHandler(agent) {
        const simImg = [
            'https://store.ais.co.th/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/1/2/12call_sim2fly_399_b_1.jpg',
            'https://store.ais.co.th/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/1/2/12call_sim2fly_899_b.jpg',
            'https://store.ais.co.th/media/catalog/product/cache/2/image/320x/040ec09b1e35df139433887a97daa66f/s/i/sim_marathon850_3.jpg'
        ]
        
     

      
        let retJSON = await https.getJSON({
            host: '110.49.202.87',
            port: 8443,
            path: '/GoogleAssistant/GetMainMenu',
            method: 'GET',
            rejectUnauthorized: false,
            agent: false,
        })
        let res1 = retJSON.menu.packages.packageList[0];
        let res2 = retJSON.menu.packages.packageList[1];
        let res3 = retJSON.menu.packages.packageList[2];
        const packagename1 = res1.packageName_TH;
        const packagedetail1 = res1.packageDetail_TH;
        const packagename2 = res2.packageName_TH;
        const packagedetail2 = res2.packageDetail_TH;
        const packagename3 = res3.packageName_TH;
        const packagedetail3 = res3.packageDetail_TH;
        const greeting = res1.groupName_TH;
        let conv = agent.conv()
        conv.ask(new SimpleResponse({
           // speech: '<speak>อุ่นใจแนะนำ Sim<sub alias="ทู">2</sub>Fly ราคาประหยัดครับ</speak>',
            speech: 'อุ่นใจขอแนะนำ ' + greeting,
            text: greeting
        }))
        
        conv.ask(new Carousel({
            items: {
                'Select_399': {
                    title: packagename1,
                    description: packagedetail1,
                    image: new Image({
                        url: simImg[0], alt: packagename1
                    })
                },
                'Select_899': {
                     title: packagename2 ,
                    description: packagedetail2 ,
                    image: new Image({
                        url: simImg[1], alt: packagename2
                    })
                },
                'Select_600': {
                     title: packagename3 ,
                    description: packagedetail3 ,
                    image: new Image({
                        url: simImg[2], alt: packagename3 
                    })
                }
            }
        }))
        agent.add(conv)
    }

    function onTopHandler(agent) {
        agent.add(`<speak>สามารถเลือกแพกเกจเสริมได้ที่แอป My <say-as interpret-as="verbatim">AIS</say-as> ครับ</speak>`)
        agent.add(new Suggestion(`Open MY AIS`))
    }

    async function balanceHandler(agent) {
        let retJSON = await https.getJSON({
            host: '110.49.202.87',
            port: 8443,
            path: '/GoogleAssistant/GetCurrentBalacnce/66932780014',
            method: 'GET',
            rejectUnauthorized: false,
            agent: false,
        })
        agent.add(`คุณมียอดเงินคงเหลือ ${retJSON.balance} บาท สนใจเติมเงินมั้ยครับ`)
        agent.add(new Suggestion(`Open MY AIS`))
    }

    let intentMap = new Map()

    intentMap.set('Default Welcome Intent', balanceHandler)
    intentMap.set('Default Fallback Intent', fallback)
    intentMap.set('Ontop-Promotion', bestSellerHandler)
    intentMap.set('Balance', balanceHandler)
    //intentMap.set('top-up', balanceHandler)
    agent.handleRequest(intentMap)
})

app.listen(PORT, (error) => {
    if (error) {
        console.log(error)
    }
    else {
        console.log(`listening at port ${PORT}`)
    }
})
