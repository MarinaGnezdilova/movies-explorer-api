const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  patchUserProfile,
  getUserInfo,
} = require('../controllers/user');

/*const regexLink = /^https?:\/\/[a-z0-9~_\-\.]+\.[a-z]{2,9}([a-z0-9\[\]\#\-\.\_\~\/\?\@\!\$\&\'\(\)\*\+\,\;\:\=]*)?$/i;*/
const regexEmail = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i;
router.get('/users/me/', getUserInfo);
router.patch('/users/me/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().pattern(regexEmail)
  }),
}), patchUserProfile);
module.exports = router;
