const express = require('express');
const router = express.Router();
const {UserController} = require('../controllers');
const {isLogged,isNotLogged, newUserValidation} = require('./middlewares');
/**
 * GET
 */

router.get('/',isLogged, UserController.getAllUsers);
router.get('/:id',isLogged, UserController.getUserById);

/**
 * POST
 */

router.post('/',isLogged, newUserValidation, UserController.createUser);
router.post('/login',isNotLogged, UserController.login);

/**
 * PUT
 */

router.put('/:id',isLogged, UserController.updateUserById);

/**
 * DELETE
 */

router.delete('/:id',isLogged, UserController.softDeleteUserById);

module.exports = router;
