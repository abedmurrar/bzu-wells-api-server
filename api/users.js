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
 * GET
 */
router.get('/session', UserController.getSession);
router.get('/logout', isLogged, UserController.logout);
router.get('/', isLogged, UserController.getAllUsers);
router.get('/:id', isLogged, idParamNumeric, checkValidationErrors, UserController.getUserById);
/**
 * POST
 */

router.post(
    '/',
    /* isAdmin, */ newUserValidation,
    checkValidationErrors,
    UserController.createUser
);
router.post('/login', isNotLogged, loginValidation, checkValidationErrors, UserController.login);

/**
 * PUT
 */
// TODO: admin can update users
router.put(
    '/:id',
    isLogged,
    idParamNumeric,
    checkValidationErrors,
    isSameUser('Forbidden, can not update other user'),
    UserController.updateUserById
);
router.put(
    '/:id/password',
    isLogged,
    idParamNumeric,
    changePasswordValidation,
    checkValidationErrors,
    isSameUser('Forbidden, can not change other user password'),
    UserController.changePassword
);
/**
 * DELETE
 */

router.delete(
    '/:id',
    isAdmin,
    idParamNumeric,
    checkValidationErrors,
    UserController.softDeleteUserById
);

/**
 * Router Middlewares
 */
router.use(errorHandler);

module.exports = router;
