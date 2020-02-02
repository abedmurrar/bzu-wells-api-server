/* eslint-disable no-plusplus */
/* eslint-disable no-bitwise */
const createError = require('http-errors');
const crypto = require('crypto');
const debug = require('debug')('bzu-wells-server-api:users-controller');
const { User } = require('../models');
const { isHashCorrect } = require('../helpers/utilFunctions');
const { OK, CREATED, NO_CONTENT, FORBIDDEN, NOT_FOUND } = require('../helpers/http-status-codes');

/**
 * Users controller for handling requests
 * /users
 */
class UserController {
    /**
     * Get All Users
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async getAllUsers(req, res, next) {
        debug('get all users function called');
        try {
            const users = await User.query()
                .columns('id', 'first_name', 'last_name', 'username', 'role')
                .select()
                .where('is_active', true)
                .throwIfNotFound();
            res.status(OK).json(users);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Get one user by id
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async getUserById(req, res, next) {
        debug('get user by id function called');

        try {
            const user = await User.query()
                .columns('id', 'first_name', 'last_name', 'username')
                .findById(req.params.id)
                .where('is_active', true)
                .throwIfNotFound();
            res.status(OK).json(user);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Create a new user
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async createUser(req, res, next) {
        debug('create user function called');

        try {
            const createdUser = await User.query().insertGraphAndFetch(req.body);
            res.status(CREATED).json(createdUser);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Update logged in user
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async updateMe(req, res, next) {
        debug('update me function called');

        try {
            const {
                session: {
                    user: { id }
                }
            } = req;
            const updatedUser = await User.query()
                .patchAndFetchById(id, req.body)
                .where('is_active', true)
                .skipUndefined()
                .throwIfNotFound();
            res.status(OK).json(updatedUser);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Update an existing user by id
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async updateUserById(req, res, next) {
        debug('update user by id function called');

        try {
            const {
                params: { id }
            } = req;
            const updatedUser = await User.query()
                .patchAndFetchById(id, req.body)
                .where('is_active', true)
                .skipUndefined()
                .throwIfNotFound();
            res.status(OK).json(updatedUser);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Update an existing user by id
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async changePassword(req, res, next) {
        debug('change password function called');

        try {
            const {
                body: { newPassword },
                session: { user }
            } = req;
            const newSalt = crypto.randomBytes(10).toString('hex');
            const newPasswordHash = crypto
                .pbkdf2Sync(newPassword, newSalt, 100, 32, 'sha256')
                .toString('hex');
            const updatedUser = await User.query()
                .patchAndFetchById(user.id, { password: newPasswordHash, salt: newSalt })
                .throwIfNotFound();
            res.status(OK).json(updatedUser);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Soft Delete current user
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async softDeleteMe(req, res, next) {
        debug('soft delete me function called');

        try {
            const {
                session: {
                    user: { id }
                }
            } = req;

            await User.query()
                .patch({ is_active: false })
                .findById(id)
                .throwIfNotFound();
            res.status(NO_CONTENT).json(null);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Soft Delete an existing user by id
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async softDeleteUserById(req, res, next) {
        debug('soft delete user by id function called');

        try {
            const {
                params: { id }
            } = req;

            await User.query()
                .patch({ is_active: false })
                .findById(id)
                .throwIfNotFound();
            res.status(NO_CONTENT).json(null);
        } catch (err) {
            next(err);
        }
    }

    /**
     * user login using username and password in request body
     * @param req
     * @param res
     * @param next
     */
    static async login(req, res, next) {
        debug('login function called');

        try {
            const { username, password: entryPassword } = req.body;
            const user = await User.query()
                .select()
                .where('username', username)
                .first()
                .throwIfNotFound();
            if (isHashCorrect(entryPassword, user.password, user.salt, 100)) {
                const { password, salt, ...userAttributes } = user;
                req.session.user = userAttributes;
                req.session.save();
                return res.status(OK).json(user);
            }
            return next(createError(FORBIDDEN, 'Username or password incorrect'));
        } catch (err) {
            next(err);
        }
    }

    /**
     * Logout user and destroy session
     * @param req
     * @param res
     * @param next
     */
    static logout(req, res, next) {
        debug('logout function called');

        req.session.destroy(err => {
            if (err) next(err);
            res.status(NO_CONTENT).json(null);
        });
    }

    /**
     * get active session for user
     * if no active session, return 404
     * @param req
     * @param res
     * @param next
     */
    static getSession(req, res, next) {
        debug('get session function called');

        if (req.session && req.session.user) {
            return res.status(OK).json(req.session.user);
        }
        return next(createError(NOT_FOUND, 'No session found'));
    }
}

module.exports = UserController;
