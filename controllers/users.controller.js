const {User} = require('../models');

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
            res.json(users)
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
            res.json(user)
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
            const updatedUser = await User
                .query()
                .patchAndFetchById(req.params.id, req.body)
                .where('is_active', true)
                .throwIfNotFound();
            res.json(updatedUser);
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
            await User
                .query()
                .patch({is_active: false})
                .findById(req.params.id)
                .throwIfNotFound();
            res.json(null);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = UserController;