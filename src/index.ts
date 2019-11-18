import {config} from 'dotenv'; config()
import {createServer} from 'http'
import express  from 'express'


import {db} from 'core';
import {createRoutes} from 'core'
import {createSocket} from 'core'


const 
    app = express(),
    http = createServer(app),
    io = createSocket(http)

db.connect()
createRoutes(app, io)


http.listen(process.env.PORT, () => {
    console.log(`Listeing on http://0.0.0.0:${process.env.PORT}`)
})