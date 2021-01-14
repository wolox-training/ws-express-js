const bcrypt = require('bcrypt');

const HashUtils = module.exports;

HashUtils.generateHashedPassword = password => bcrypt.hash(password, 10);

HashUtils.comparePassword = (password, hashedPassword) => bcrypt.compare(password, hashedPassword);
