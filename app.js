const express = require('express');

const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const { db } = process.env;
mongoose.connect(db);

const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { postUser, login } = require('./controllers/user');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const CenterError = require('./errors/centerError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const limiter = rateLimit({
  windowMs: 100,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
const regexEmail = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i;
app.use('*', cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(limiter);
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
app.use('/', require('./routes/index'));

app.all((req, res, next) => next(new NotFoundError('Страница не найдена.')));

app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => next(new CenterError('На сервере произошла ошибка')));
app.listen(3000, () => {
  console.log('App listening on port 3000');
});
