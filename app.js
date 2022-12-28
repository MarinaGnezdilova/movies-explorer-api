const express = require('express');

const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://0.0.0.0:27017/bitfilmsdb');

const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const { postUser, login } = require('./controllers/user');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('cors');
const regexEmail = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i;
/*const urlRegExp = /^https?:\/\/[a-z0-9~_\-\.]+\.[a-z]{2,9}([a-z0-9\[\]\#\-\.\_\~\/\?\@\!\$\&\'\(\)\*\+\,\;\:\=]*)?$/i;*/
/*const options = {
  origin: [
    'http://localhost:3001',
    'http://localhost:3000',
    
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization']
};*/
app.use('*',cors());
/*app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Headers, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');

  next();
});
app.options('*', function (req,res) { res.sendStatus(200); });*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
}); 
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(regexEmail),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), postUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(regexEmail),
    password: Joi.string().required(),
  }),
}), login);
app.use(auth);
app.use('/', require('./routes/user'));
app.use('/', require('./routes/movie'));

app.all((req, res, next) => next(new NotFoundError('Страница не найдена.')));

app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});
app.listen(3000, () => {
  console.log('App listening on port 3000');
});
