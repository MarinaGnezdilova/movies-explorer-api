const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMovies,
  postMovie,
  deleteMovie
} = require('../controllers/movie');

const regex = /^https?:\/\/[a-z0-9~_\-\.]+\.[a-z]{2,9}([a-z0-9\[\]\#\-\.\_\~\/\?\@\!\$\&\'\(\)\*\+\,\;\:\=]*)?$/i;
router.get('/movies', getMovies);
router.post('/movies', celebrate({
  body: Joi.object().keys({
    nameRU:Joi.string().required(),
    nameEN:Joi.string().required(),
    country:Joi.string().required(),
    director:Joi.string().required(),
    duration:Joi.string().required(),
    year:Joi.string().required(),
    description:Joi.string().required(),
    image:Joi.string().required().pattern(regex),
    trailerLink:Joi.string().required().pattern(regex),
    thumbnail:Joi.string().required().pattern(regex),
    owner:Joi.string().length(24).hex(),
    movieId:Joi.string().length(24).hex()
  }),
}), postMovie);
router.delete('/movies/:movieId', /*celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().length(24).hex(),
  }),
}),*/ deleteMovie);
module.exports = router;
