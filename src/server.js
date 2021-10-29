import express from 'express'
import cors from 'cors'
import listEndpoints from 'express-list-endpoints'
import mediaRouter from './services/media/media.js'


const server = express()



const whitelist = [process.env.HOST, process.env.FE_LOCAL_URL, process.env.FE_PUBLIC_URL]
const corsOpts = {
  origin: function (origin, next) {
    console.log("CURRENT ORIGIN: ", origin)
    if (!origin || whitelist.indexOf(origin) !== -1) {
      next(null, true)
    } else {
      next(new Error("CORS ERROR"))
    }
  },
}



server.use(cors(corsOpts))
// server.use(express.static(publicFolderPath))

server.use(express.json())

server.use('/media', mediaRouter)

const port = process.env.PORT



console.table(listEndpoints(server));


server.listen(port, ()=>{
    console.log('server running on port:', port)

})