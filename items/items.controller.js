const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize');
const itemService = require('./item.service');
const userService = require('../users/user.service');
const moment = require('moment');
const multer = require('multer');

function itemSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required()
    });
    validateRequest(req, next, schema);
}

function createItem(req, res, next) {
    const params = {
        ...req.body,
        user_id: req.user.id,
        created_at: moment().utc().format()
    };

    itemService.create(params)
        .then(item => res.json(item))
        .catch(next => next);
}

async function addUsersInfoToItems(items) {
    const promiseArray = [];

    if (!items.length) {
        throw 'Items not found!';
    }

    for (const item of items) {
        promiseArray.push(addUserInfoToItem(item));
    }

    return Promise.all(promiseArray);
}

async function addUserInfoToItem(item) {
    item.dataValues.user = await userService.getUser(item.dataValues.user_id);
    return item
};

function getAll(req, res, next) {
    itemService.getAll()
        .then(items => addUsersInfoToItems(items))
        .then(preparedItems => res.json(preparedItems))
        .catch(next);
}

function getItem(req, res, next) {
    itemService.getItemById(req.params.id)

    .then(item => {
        return res.json(item)

    })
    .catch(next);
    console.log("req.params.id", req.params.id);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().empty(''),
        price: Joi.number().empty('')
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    itemService.update(req.params.id, req.body)
        .then(item => res.json(item))
        .catch(next);
}

function _delete(req, res, next) {
    itemService.delete(req.params.id)
        .then(() => res.json({message: 'Item deleted successfully'}))
        .catch(next)
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },

    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        cb(null, file.originalname + '-' + Date.now() + '.' + extension);
    }
});

const upload = multer({ storage: storage }).single('file');

router.post('/items', authorize(), itemSchema, createItem);
router.get('/items', authorize(), getAll);
router.get('/items/:id', authorize(), getItem);
router.put('/items/:id', authorize(), updateSchema, update);
router.delete('/items/:id', authorize(), _delete);
router.post('/items/:id/images', authorize(), (req, res, next) => {
    upload(req,res, function(err) {
        if (err) {
            res.send('error uploading file');
        }

        const url = `http://localhost:4000/api/${req.file.path}`;

        itemService.updateItemImage(req.params.id, { image: url})
            .then(item => res.json(item))
            .catch(next);
    })
});


module.exports = router;