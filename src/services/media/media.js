import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import express from 'express'
import uniqid from 'uniqid'
import multer from 'multer'
import { extname } from 'path'
import sgMail from "@sendgrid/mail"
import createHttpError from 'http-errors'
import { pipeline } from "stream"
import json2csv from "json2csv"



const mediaRouter = express.Router()

mediaRouter.get('/', async (req, res, next) =>{

    console.log('trying')
})




export default mediaRouter