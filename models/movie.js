const mongoose = require('mongoose');

const urlRegExp = /^https?:\/\/[a-z0-9~_\-\.]+\.[a-z]{2,9}([a-z0-9\[\]\#\-\.\_\~\/\?\@\!\$\&\'\(\)\*\+\,\;\:\=]*)?$/i;
const cardSchema = new mongoose.Schema({
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => urlRegExp.test(v),
      message: 'Поле "image" должно быть ссылкой.',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (v) => urlRegExp.test(v),
      message: 'Поле "trailerLink" должно быть ссылкой.',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => urlRegExp.test(v),
      message: 'Поле "thumbnail" должно быть ссылкой.',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  /*movieId: {
    type: String,
    required: true,
  },*/
});
module.exports = mongoose.model('movie', cardSchema);
