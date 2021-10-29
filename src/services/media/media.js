import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import express from "express";
import uniqid from "uniqid";
import multer from "multer";
import { extname } from "path";
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { v2 as cloudinary } from "cloudinary"
 


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
const writeReviews = (revs) => writeJSON(reviewsJSON, revs)




const { CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET } = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_KEY,
  api_secret: CLOUDINARY_SECRET,
});


const cloudinaryStorage = new CloudinaryStorage({
	cloudinary:cloudinary
})

//add poster to single media
// add pdf to dowload reviews 



mediaRouter.post('/', async (req, res, next) =>{
    const newMedia = {
        ...req.body,
        imdbID: uniqid()
    };

    const media = await getMedia();

    media.push(newMedia);

    await writeJSON(mediaJSON, media);

    res.status(201).send(newMedia);


})
mediaRouter.put('/:id', async (req, res, next) =>{

    const media = await getMedia()

    const mediaIndex = media.findIndex(media=>media.imdbID===req.params.id)

    const updatedMedia = {
        ...media[mediaIndex],
        ...req.body
    }
    media[mediaIndex] = updatedMedia

    await writeJSON(mediaJSON, media)

    res.status(200).send(updatedMedia)

})

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

        

      if(req.query){
        console.log(media[0].Title)
       const filtered = media.filter((media) => media.Title.includes(req.query.title))
        console.log(filtered)
        res.status(200).send(filtered);
      }else{
       
        res.status(200).send(media);
      }
         


  
      
   
       
     
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


    res.status(200).send(singleMedia)




  
  } catch (error) {
    next(error);
  }
});
mediaRouter.delete('/:id', async (req, res, next) =>{

    const media = await getMedia()
    const deletedMedia = media.filter((media)=> media.imdbID!==req.params.id)


    await writeMedia(deletedMedia)

    res.status(204).send(media)
    
})


mediaRouter.post('/:id/reviews', async (req, res, next)=>{

    const newReview = {
        ...req.body,
        _id: uniqid(),
        elementId: req.params.id,
      
        createdAt: new Date()
    };

    const reviews = await getReviews();

    reviews.push(newReview);

    await writeJSON(reviewsJSON, reviews);

    res.status(201).send(newReview);
    
})


mediaRouter.delete('/:id/reviews', async (req, res, next)=>{
    const reviews = await getReviews()
    const  deletedRevs = reviews.filter((revs)=>revs._id!==req.params.id)

    await writeReviews(deletedRevs)

    res.status(204).send('reviewhas been deleted')
})



mediaRouter.put('/:idIMG/img', multer({storage:cloudinaryStorage}).single('Poster'), async(req, res, next)=>{
  const media = await getMedia()
  const mediaIndex = media.findIndex(media=>media.imdbID===req.params.idIMG)

  media[mediaIndex].Poster = req.file.path
  await writeMedia(media)

  res.status(201).send(media[mediaIndex])

})



export default mediaRouter;
