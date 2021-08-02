
require('dotenv').config();
const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
  });

  cloudinary.v2.uploader.upload("../../../../../../",
  { public_id: "sample_woman" }, 
  function(error, result) {console.log(result); });

  const express = require ("express")
  const router = express.router;

  router.post('/movies/create', fileUploader.single('movie-cover-image'), (req, res) => {
    const { title, description } = req.body;
   
    Movie.create({ title, description, imageUrl: req.file.path })
      .then(newlyCreatedMovieFromDB => {
        console.log(newlyCreatedMovieFromDB);
      })
      .catch(error => console.log(`Error while creating a new movie: ${error}`));
  });
   
  module.exports = router;