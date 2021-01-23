const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize');
const userService = require('./user.service');

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(response => res.json(response))
        .catch(next);
}

function registerSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        phone: Joi.string(),
        email: Joi.string().email({ tlds: { allow: false } }).required(),
        password: Joi.string().min(6).required()
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    userService.create(req.body)
        .then(user => userService.authenticateUserById(user.dataValues.id))
        .then((response) => res.json(response))
        .catch(next);
}

function getCurrent(req, res, next) {
    res.json(req.user);
}

router.post('/login', authenticateSchema, authenticate);
router.post('/register', registerSchema, register);
router.get('/me', authorize(), getCurrent);

module.exports = router;