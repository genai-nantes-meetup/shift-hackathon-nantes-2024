const express = require('express')
const cors = require('cors')
const {response} = require("express");
const {post} = require("axios");
const app = express()
const port = 3000

app.use(cors())

app.get('/', async (req, res) => {
    try {
        const response = await post(
                'https://yptsnup7nh.execute-api.eu-west-3.amazonaws.com/default/jcvdMainScript',
                {
                    action: 'get',
                }
                ,
                {
                    headers: {
                        'Content-Type':
                            'application/json',
                    }
                    ,
                }
            )
        ;
        console.log('Status Code:', response.status);
        console.log('Response Body:', response.data);
        res.send(response.data)
    } catch (error) {
        if (error.response) {
            console.error('Status Code:', error.response.status);
            console.error('Response Body:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
