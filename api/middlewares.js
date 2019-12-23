/* eslint-disable no-plusplus */
/* eslint-disable no-bitwise */
const crypto = require('crypto');
const { body, sanitizeBody, check } = require('express-validator');
const createError = require('http-errors');
const { NOT_AUTHORIZED, FORBIDDEN } = require('../helpers/http-status-codes');

const isLogged = (req, res, next) => {
    const {
        session: { user = null }
    } = req;

    if (user && user.id) {
        next();
    } else {
        next(createError(NOT_AUTHORIZED, 'Not authorized'));
    }
};

const isLoggedOrHashSent = (req, res, next) => {
    const {
        session: { user = null },
        body: { hash = null }
    } = req;

    if ((user && user.id) || (hash && isHashCorrect(hash))) {
        next();
    } else {
        next(createError(NOT_AUTHORIZED, 'Not authorized'));
    }
};

const isNotLogged = (req, res, next) => {
    const {
        session: { user = null }
    } = req;

    if (!(user && user.id)) {
        next();
    } else {
        next(createError(FORBIDDEN, 'Forbidden'));
    }
};

const isAdmin = (req, res, next) => {
    const {
        session: { user = null }
    } = req;
    if (user && user.id && user.role === 'admin') {
        next();
    } else {
        next(createError(FORBIDDEN, 'Forbidden'));
    }
};

const isSameUser = (req, res, next) => {
    const {
        session: { user = null }
    } = req;
    if (user && user.id && parseInt(req.params.id, 10) === user.id) {
        next();
    } else {
        next(createError(FORBIDDEN, 'Forbidden'));
    }
};

const newUserValidation = [
    check('first_name')
        .not()
        .isEmpty()
        .withMessage('First name is required')
        .isString()
        .withMessage('First name must be a string')
        .trim()
        .escape(),
    check('last_name')
        .not()
        .isEmpty()
        .withMessage('Last name is required')
        .isString()
        .withMessage('Last name must be a string')
        .trim()
        .escape(),
    check('username')
        .not()
        .isEmpty()
        .withMessage('Username is required')
        .isString()
        .withMessage('Username must be a string')
        .isLength({ max: 20 })
        .withMessage('Must be at least 20 characters long')
        .trim()
        .escape(),
    check('password')
        .not()
        .isEmpty()
        .withMessage('Password is required')
        .isString()
        .withMessage('Password must be a string')
];

const readingValidation = [
    body('reading')
        .isNumeric()
        .withMessage('Reading must be a numeric value')
];

const newWellValidation = [
    check('name')
        .not()
        .isEmpty()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a string')
        .trim()
        .escape(),
    check('depth')
        .isNumeric({ no_symbols: true })
        .withMessage('Depth must be numeric'),
    check('volume')
        .isNumeric()
        .withMessage('Volume must be numeric')
];

const isHashCorrect = entry => {
    const hash = crypto.pbkdf2Sync('password', 'salt', 1000, 32, 'sha256').toString('hex');
    let mismatch = 0;
    for (let i = 0, len = hash.length; i < len; i++) {
        mismatch |= entry.charCodeAt(i) ^ hash.charCodeAt(i);
        if (mismatch) {
            break;
        }
    }
    return !mismatch;
};

module.exports = {
    isAdmin,
    isNotLogged,
    isLogged,
    isLoggedOrHashSent,
    isSameUser,
    newUserValidation,
    readingValidation,
    newWellValidation
};
