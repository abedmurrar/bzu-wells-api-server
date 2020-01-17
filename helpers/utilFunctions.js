/* eslint-disable no-plusplus */
/* eslint-disable no-bitwise */
const crypto = require('crypto');

const HASH_SALT = '98wejfc0m2m23um289';

const isHashCorrect = (entry, _hash, salt = HASH_SALT) => {
    const hash = crypto.pbkdf2Sync(entry, salt, 1000, 32, 'sha256').toString('hex');
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
