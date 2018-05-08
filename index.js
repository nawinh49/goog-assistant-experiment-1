const processor = require('./processor')
const express = require('express'),
    bodyParser = require('body-parser')
const { WebhookClient } = require('dialogflow-fulfillment')

// HTTP
const http = require('http')
const https = require('https');

const app = express(bodyParser.json())

const unirest = require('unirest');

app.use(bodyParser.json())

//app.get('/', (request, response) => response.send({"msg": "Hello world!"}))

app.get('/', (request, response) => {
    unirest.get("https://10.137.28.40:8443/GoogleAssistant/GetCurrentBalacnce/66932780014")
    .strictSSL(false)
    .end(function(res) {
        if (res.error) {
            console.log('GET error', res.error)
            
        } else {
           // console.log('GET response', res.body)
          
                var data = res.body;
                var data2 = JSON.parse(data);
                console.log(data2.balance);
     

         
        }
    }    
    ) 
}
);


app.post('/', (req, res) => {
    console.log("Request Header: " + JSON.stringify(req.headers))
    console.log("Request Body: " + JSON.stringify(req.body))

    req = processor(req)

    const agent = new WebhookClient({request: req, response: res})

    function welcome(agent) {
        agent.add(`welcome to my agent`)
    }

    function fallback(agent) {
        agent.add(`I don't understand`)
        agent.add(`I am sorry. Can you repeat again`)
    }

    let intentMap = new Map()

    intentMap.set('Default Welcome Intent', welcome)
    intentMap.set('Default Fallback Intent', fallback)
    
    agent.handleRequest(intentMap)
})

app.listen(4200, (error) => {
    if (error) {
        console.log(error)
    }
    else {
        console.log("listening at port 4200")
    }
})
