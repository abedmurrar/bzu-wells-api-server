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
    loginValidation,
    changePasswordValidation,
    idParamNumeric,
    checkValidationErrors,
    errorHandler
} = require('./middlewares');


/**
 * Router Middlewares
 */
router.use(errorHandler);

/**
 * GET
 */
router.get('/me', UserController.getSession);
router.get('/logout', isLogged, UserController.logout);
router.get('/', isLogged, UserController.getAllUsers);
router.get('/:id', isLogged, idParamNumeric, checkValidationErrors, UserController.getUserById);

/**
 * POST
 */
router.post('/', isAdmin, newUserValidation, checkValidationErrors, UserController.createUser);
router.post('/login', isNotLogged, loginValidation, checkValidationErrors, UserController.login);

/**
 * PUT
 */
router.put('/me', isLogged, checkValidationErrors, UserController.updateMe);
router.put('/:id', isAdmin, idParamNumeric, checkValidationErrors, UserController.updateUserById);
router.put(
    '/me/password',
    isLogged,
    changePasswordValidation,
    checkValidationErrors,
    UserController.changePassword
);

/**
 * DELETE
 */
//TODO: close session on success
router.delete('/me', isLogged, UserController.softDeleteMe);
router.delete(
    '/:id',
    isAdmin,
    idParamNumeric,
    checkValidationErrors,
    UserController.softDeleteUserById
);


module.exports = router;
