const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMovies,
  postMovie,
  deleteMovie,
} = require('../controllers/movie');

const {
  patchUserProfile,
  getUserInfo,
} = require('../controllers/user');

const regex = /^https?:\/\/[a-z0-9~_\-\.]+\.[a-z]{2,9}([a-z0-9\[\]\#\-\.\_\~\/\?\@\!\$\&\'\(\)\*\+\,\;\:\=]*)?$/i;
const regexEmail = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i;
router.get('', getMovies);
router.post('/movies', celebrate({
  body: Joi.object().keys({
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().required()/*.pattern(regex)*/,
    trailerLink: Joi.string().required()/*.pattern(regex)*/,
    thumbnail: Joi.string().required()/*.pattern(regex)*/,
    owner: Joi.string().length(24).hex(),
    /*movieId: Joi.number().required(),*/
  }),
}), postMovie);
router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().length(24).hex(),
  }),
}), deleteMovie);
router.get('/users/me/', getUserInfo);
router.patch('/users/me/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().pattern(regexEmail),
  }),
}), patchUserProfile);
module.exports = router;
