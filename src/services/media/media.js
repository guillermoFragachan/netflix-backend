import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import express from "express";
import uniqid from "uniqid";
import multer from "multer";
import { extname } from "path";
import sgMail from "@sendgrid/mail";
import createHttpError from "http-errors";
import { pipeline } from "stream";
import json2csv from "json2csv";
import { get } from "http";
import { read } from "fs";

const { readJSON, writeJSON, writeFile, createReadStream } = fs;

const mediaRouter = express.Router();

const mediaJSON = join(
  dirname(fileURLToPath(import.meta.url)),
  "../data/media.json"
);
const reviewsJSON = join(
    dirname(fileURLToPath(import.meta.url)),
    "../data/reviews.json"
  );
  
const getReviews = () => readJSON(reviewsJSON)
const getMedia = () => readJSON(mediaJSON);
const writeMedia = (media) => writeJSON(mediaJSON, media);



// post media

//update media

//delete media

//add poster to single media


// post and delete Reviews

//export pdf with revs
mediaRouter.get("/", async (req, res, next) => {
    try {
      const media = await getMedia();
      const revs = await getReviews()

      media.map((media)=>{

        revs.map((revs)=>{

            if(media.imdbID===revs.elementId){
                media.reviews = revs
                
          }
        })
         


      })
      
   
        res.status(200).send(media);
     
    } catch (error) {
      next(error);
    }
  });



mediaRouter.get("/:id", async (req, res, next) => {
  try {

    const media = await getMedia();
    const revs = await getReviews()
    const singleMedia = media.filter((media) => media.imdbID ===req.params.id)

    const revsById =  revs.filter((revs)=>revs.elementId === req.params.id)
   

    singleMedia[0].reviews= revsById
    console.log(singleMedia)


    res.status(200).send(singleMedia)




  
  } catch (error) {
    next(error);
  }
});





export default mediaRouter;
