/* eslint-disable no-useless-escape */
const express = require('express');

const router = express.Router();
const { UserController } = require('../controllers');
const {
    isLogged,
    isAdmin,
    isNotLogged,
    isSameUser,
    newUserValidation,
    checkValidationErrors
} = require('./middlewares');

/**
 * GET
 */
router.get('/session', UserController.getSession);
router.get('/logout', isLogged, UserController.logout);
router.get('/', isLogged, UserController.getAllUsers);
router.get('/:id', isLogged, UserController.getUserById);
/**
 * POST
 */

router.post('/', isAdmin, newUserValidation, checkValidationErrors, UserController.createUser);
router.post('/login', isNotLogged, UserController.login);

/**
 * PUT
 */
// TODO: admin can update users
router.put(
    '/:id',
    isLogged,
    isSameUser,
    /* checkValidationErrors, */ UserController.updateUserById
);
router.put('/:id/password', isLogged, isSameUser, UserController.changePassword);
/**
 * DELETE
 */

router.delete('/:id', isAdmin, UserController.softDeleteUserById);

module.exports = router;
