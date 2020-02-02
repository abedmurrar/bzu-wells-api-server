/* eslint-disable no-plusplus */
/* eslint-disable no-bitwise */
const crypto = require('crypto');
const debug = require('debug')('bzu-wells-server-api:util-functions');

const HASH_SALT = '98wejfc0m2m23um289';

const isHashCorrect = (entry, _hash, salt = HASH_SALT, rounds = 1000) => {
    debug('is hash correct util function called')
    const hash = crypto.pbkdf2Sync(entry, salt, rounds, 32, 'sha256').toString('hex');
    let mismatch = 0;
    for (let i = 0, len = hash.length; i < len; ++i) {
        mismatch |= _hash.charCodeAt(i) ^ hash.charCodeAt(i);
        if (mismatch) {
            break;
        }
    }
    return !mismatch;
};

module.exports = {
    HASH_SALT,
    isHashCorrect
};
