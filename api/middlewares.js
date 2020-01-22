/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-bitwise */
const { body, param, validationResult } = require('express-validator');
const createError = require('http-errors');
const {
    ValidationError,
    NotFoundError,
    DBError,
    // ConstraintViolationError,
    UniqueViolationError,
    NotNullViolationError,
    ForeignKeyViolationError,
    CheckViolationError,
    DataError
} = require('objection');
const { User } = require('../models');
const {
    BAD_REQUEST,
    NOT_FOUND,
    CONFLICT,
    NOT_AUTHORIZED,
    FORBIDDEN,
    UNPROCESSABLE_ENTITY,
    INTERNAL_SERVER_ERROR
} = require('../helpers/http-status-codes');
const { isHashCorrect } = require('../helpers/utilFunctions');

/**
 * Custom middleware to check if
 * user session created which means
 * that current user is logged in
 * @param req
 * @param res
 * @param next
 */
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

/**
 * Custom middleware to check if
 * user session created which means
 * that current user is logged in
 *
 * or
 *
 * that a hash is sent with request body
 * for hashing the well id and reading
 * this method is only used for the
 * raspberry pi
 * @param req
 * @param res
 * @param next
 */
const isLoggedOrHashSent = (req, res, next) => {
    const {
        session: { user = null },
        body: { hash = null, reading },
        params: { id }
    } = req;

    // Reconstruct string
    const readingLine = `${id}#${reading}`;

    if ((user && user.id) || (hash && isHashCorrect(readingLine, hash))) {
        next();
    } else {
        next(createError(NOT_AUTHORIZED, 'Not authorized'));
    }
};

/**
 * Custom middleware to check that
 * current session has no user
 *
 * @param req
 * @param res
 * @param next
 */
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

/**
 * Custom middleware to check if
 * user session created which means
 * that current user is logged in
 * and
 * that current user's role is admin
 *
 * @param req
 * @param res
 * @param next
 */
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

/**
 * Custom middleware to check that
 * current user requesting on /users/{id}
 * has the same id in the request parameters (in URL)
 * @param {string} err
 * @param req
 * @param res
 * @param next
 */
const isSameUser = (err = 'Error') => (req, res, next) => {
    const {
        session: { user = null }
    } = req;
    if (user && user.id && parseInt(req.params.id, 10) === user.id) {
        next();
    } else {
        next(createError(FORBIDDEN, err));
    }
};

/**
 * Custom middleware to validate request body
 * for new user request
 */
const newUserValidation = [
    body('first_name')
        .exists()
        .not()
        .isEmpty()
        .withMessage('First name is required')
        .isString()
        .withMessage('First name must be a string')
        .trim()
        .escape(),
    body('last_name')
        .exists()
        .not()
        .isEmpty()
        .withMessage('Last name is required')
        .isString()
        .withMessage('Last name must be a string')
        .trim()
        .escape(),
    body('username')
        .exists()
        .not()
        .isEmpty()
        .withMessage('Username is required')
        .isString()
        .withMessage('Username must be a string')
        .isLength({ max: 20 })
        .withMessage('Must be at least 20 characters long')
        .trim()
        .escape(),
    body('password')
        .exists()
        .not()
        .isEmpty()
        .withMessage('Password is required')
        .isString()
        .withMessage('Password must be a string')
];

/**
 * Custom middleware to validate request body
 * for login
 */
const loginValidation = [
    body('username')
        .exists()
        .not()
        .isEmpty()
        .withMessage('Username is required')
        .isString()
        .withMessage('Username must be a string')
        .isLength({ max: 20 })
        .withMessage('Must be at least 20 characters long')
        .trim()
        .escape()
        .custom()
        .bail(async (value, { req }) => {
            const user = await User.query()
                .columns('id')
                .where('username', req.body.username)
                .first()
                .throwIfNotFound();
            if (!isHashCorrect(value, user.password, user.salt, 100)) {
                throw new Error('Incorrect password');
            }
        }),
    body('password')
        .exists()
        .not()
        .isEmpty()
        .withMessage('Password is required')
        .isString()
        .withMessage('Password must be a string')
        .custom(async (value, { req }) => {
            const user = await User.query()
                .columns('password', 'salt')
                .where('username', req.body.username)
                .first()
                .throwIfNotFound();
            if (!isHashCorrect(value, user.password, user.salt, 100)) {
                throw new Error('Incorrect password');
            }
        })
];

const changePasswordValidation = [
    body('currentPassword')
        .exists()
        .not()
        .isEmpty()
        .withMessage('Password is required')
        .isString()
        .withMessage('Password must be a string')
        .custom(async (value, { req }) => {
            const {
                session: { user }
            } = req;

            const currentUser = await User.query()
                .columns('password', 'salt')
                .findById(user.id)
                .where('is_active', true);
            if (!isHashCorrect(value, currentUser.password, currentUser.salt, 100)) {
                throw new Error('Current password is incorrect');
            }
        }),
    body('newPassword')
        .exists()
        .not()
        .isEmpty()
        .withMessage('Password is required')
        .isString()
        .withMessage('Password must be a string'),
    body('confirmPassword', 'confirmPassword field must have the same value as the password field')
        .exists()
        .not()
        .isEmpty()
        .withMessage('Password is required')
        .isString()
        .withMessage('Password must be a string')
        .custom((value, { req }) => value === req.body.newPassword)
];

/**
 * Custom middleware to validate request body
 * for new well entry
 */
const newWellValidation = [
    body('name')
        .exists()
        .not()
        .isEmpty()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a string')
        .trim()
        .escape(),
    body('depth')
        .exists()
        .isNumeric({ no_symbols: true })
        .withMessage('Depth must be numeric')
        .toFloat(),
    body('volume')
        .exists()
        .isNumeric()
        .withMessage('Volume must be numeric')
        .toInt()
];

/**
 * Custom middleware to validate request body
 * for new reading entry
 */
const readingValidation = [
    body('reading')
        .exists()
        .isNumeric()
        .withMessage('Reading must be a numeric value')
        .toInt(10)
];

/**
 * Custom middleware to validate request parameter
 * id if it is an integer
 */
const idParamNumeric = param('id')
    .exists()
    .not()
    .isEmpty()
    .withMessage('id parameter is required in url')
    .isInt()
    .withMessage('ID parameter must be an integer')
    .toInt(10);

/**
 * Custom middleware to return validation errors
 * in response body as an array
 *
 * @param req
 * @param res
 * @param next
 */
const checkValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(UNPROCESSABLE_ENTITY).json({ errors: errors.mapped() });
    }

    next();
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    if (err instanceof ValidationError) {
        switch (err.type) {
            case 'ModelValidation':
                res.status(BAD_REQUEST).send({
                    message: err.message,
                    type: err.type,
                    data: err.data
                });
                break;
            case 'RelationExpression':
                res.status(BAD_REQUEST).send({
                    message: err.message,
                    type: 'Relation Expression',
                    data: {}
                });
                break;
            case 'UnallowedRelation':
                res.status(BAD_REQUEST).send({
                    message: err.message,
                    type: err.type,
                    data: {}
                });
                break;
            case 'InvalidGraph':
                res.status(BAD_REQUEST).send({
                    message: err.message,
                    type: err.type,
                    data: {}
                });
                break;
            default:
                res.status(BAD_REQUEST).send({
                    message: err.message,
                    type: 'Unknown Validation Error',
                    data: {}
                });
                break;
        }
    } else if (err instanceof NotFoundError) {
        res.status(NOT_FOUND).send({
            message: err.message,
            type: 'Not Found',
            data: {}
        });
    } else if (err instanceof UniqueViolationError) {
        res.status(CONFLICT).send({
            message: err.message,
            type: 'Unique Violation',
            data: {
                columns: err.columns,
                table: err.table,
                constraint: err.constraint
            }
        });
    } else if (err instanceof NotNullViolationError) {
        res.status(BAD_REQUEST).send({
            message: err.message,
            type: 'Not Null Violation',
            data: {
                column: err.column,
                table: err.table
            }
        });
    } else if (err instanceof ForeignKeyViolationError) {
        res.status(CONFLICT).send({
            message: err.message,
            type: 'Foreign Key Violation',
            data: {
                table: err.table,
                constraint: err.constraint
            }
        });
    } else if (err instanceof CheckViolationError) {
        res.status(BAD_REQUEST).send({
            message: err.message,
            type: 'Check Violation',
            data: {
                table: err.table,
                constraint: err.constraint
            }
        });
    } else if (err instanceof DataError) {
        res.status(BAD_REQUEST).send({
            message: err.message,
            type: 'Invalid Data',
            data: {}
        });
    } else if (err instanceof DBError) {
        res.status(INTERNAL_SERVER_ERROR).send({
            message: err.message,
            type: 'Unknown Database Error',
            data: {}
        });
    } else {
        res.status(INTERNAL_SERVER_ERROR).send({
            message: err.message,
            type: 'Unknown Error',
            data: {}
        });
    }
};

module.exports = {
    isAdmin,
    isNotLogged,
    isLogged,
    isLoggedOrHashSent,
    isSameUser,
    newUserValidation,
    readingValidation,
    newWellValidation,
    loginValidation,
    changePasswordValidation,
    idParamNumeric,
    checkValidationErrors,
    errorHandler
};
