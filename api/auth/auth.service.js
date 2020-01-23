const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')

const saltRounds = 10

async function login(userName, password) {
    logger.debug(`auth.service - login with userName: ${userName}`)
    if (!userName || !password) return Promise.reject('userName and password are required!')

    const user = await userService.getByUserName(userName)
    if (!user) return Promise.reject('Invalid userName or password')
    const match = await bcrypt.compare(password, user.password)
    if (!match) return Promise.reject('Invalid userName or password')

    delete user.password;
    return user;
}

async function signUp(fullName, userName, password, about, imgUrl) {
    logger.debug(`auth.service - sign-up with username: ${userName}`)
    if (!fullName|| !userName|| !password || !about || !imgUrl) return Promise.reject('all details are required!')

    const hash = await bcrypt.hash(password, saltRounds)
    return userService.add({fullName, userName, password: hash, about, imgUrl})
}

module.exports = {
    signUp,
    login,
}