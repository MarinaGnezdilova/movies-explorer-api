const Movie = require('../models/movie');

const CREATED = 201;
const NotFoundError = require('../errors/not-found-err');
const BadRequest = require('../errors/bad-request');
const Forbidden = require('../errors/forbidden');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .sort({ createdAt: -1 })
    .then((movies) => res.send({ data: movies }))
    .catch((e) => {
      next(e);
    });
};

module.exports.postMovie = (req, res, next) => {
  Movie.create({
    country: req.body.country,
    director: req.body.director,
    duration: req.body.duration,
    year: req.body.year,
    description: req.body.description,
    image: req.body.image,
    trailerLink: req.body.trailerLink,
    thumbnail: req.body.thumbnail,
    owner: req.user.id,
    movieId: req.user.id,
    nameRU: req.body.nameRU,
    nameEN: req.body.nameEN,
  })
    .then((movie) => res.status(CREATED).send({ data: movie }))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(
          new BadRequest('Переданы некорректные данные для создании фильма.'),
        );
      } else {
        next(e);
      }
    });
};
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundError('Фильм по указанному _id не найден.');
    })
    .then((data) => {
      if (data.owner.toString() != req.user.id) {
        throw new Forbidden('Удаление фильма невозможно.');
      } else {
        return Movie.findByIdAndRemove(req.params.movieId).then((movie) => res.send({ data: movie }));
      }
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(
          new BadRequest('Переданы некорректные данные для удаления фильма.'),
        );
      } else {
        next(e);
      }
    });
};
