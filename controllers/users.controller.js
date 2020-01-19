/* eslint-disable no-plusplus */
/* eslint-disable no-bitwise */
const createError = require('http-errors');
const crypto = require('crypto');
const { User } = require('../models');
const { isHashCorrect } = require('../helpers/utilFunctions');

class UserController {
    /**
     * Get All Users
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async getAllUsers(req, res, next) {
        try {
            const users = await User.query()
                .columns('id', 'first_name', 'last_name', 'username')
                .select()
                .where('is_active', true)
                .throwIfNotFound();
            res.json(users);
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
        try {
            const user = await User.query()
                .columns('id', 'first_name', 'last_name', 'username')
                .findById(req.params.id)
                .where('is_active', true)
                .throwIfNotFound();
            res.json(user);
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
        try {
            const createdUser = await User.query().insertGraphAndFetch(req.body);
            res.json(createdUser);
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
        try {
            const updatedUser = await User.query()
                .patchAndFetchById(req.params.id, req.body)
                .where('is_active', true)
                .throwIfNotFound();
            res.json(updatedUser);
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
        try {
            const { currentPassword, newPassword, confirmPassword } = req.body;
            const { user } = req.session;

            const currentUser = await User.query()
                .columns('password', 'salt')
                .findById(user.id)
                .where('is_active', true)
                .throwIfNotFound();

            if (
                isHashCorrect(currentPassword, currentUser.password, currentUser.salt) &&
                newPassword === confirmPassword
            ) {
                const updatedUser = await User.query()
                    .patchAndFetchById(user.id, { password: newPassword })
                    .throwIfNotFound();
                res.json(updatedUser);
            } else {
                // TODO: update this error
                res.json({ message: 'error' });
            }
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
        try {
            await User.query()
                .patch({ is_active: false })
                .findById(req.params.id)
                .throwIfNotFound();
            res.json(null);
        } catch (err) {
            next(err);
        }
    }

    static async login(req, res, next) {
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
                req.session.save(() => console.log('session saved'));
                return res.json(user);
            }
            return next(createError(403, 'Username or password incorrect'));
        } catch (err) {
            next(err);
        }
    }

    static logout(req, res, next) {
        req.session.destroy(err => {
            if (err) next(err);
            res.status(200).json({ message: 'Logged out successfully' });
        });
    }

    static getSession(req, res, next) {
        if (req.session && req.session.user) {
            return res.status(200).json(req.session.user);
        }
        return next(createError(404, 'No session found'));
    }
}

module.exports = UserController;
