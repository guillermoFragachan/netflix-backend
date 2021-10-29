import express from 'express'
import cors from 'cors'
import listEndpoints from 'express-list-endpoints'
import mediaRouter from './services/media/media.js'


const server = express()







server.use(cors())
// server.use(express.static(publicFolderPath))

server.use(express.json())

server.use('/media', mediaRouter)

const port = 3001



console.table(listEndpoints(server));


server.listen(port, ()=>{
    console.log('server running on port:', port)

})