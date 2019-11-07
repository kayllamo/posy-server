const xss = require('xss')
const bcrypt = require('bcryptjs')

const UsersService = {
  hasUserWithUsername(db, user_email) {
    return db('users')
      .where({ user_email })
      .first()
      .then(user => !!user)
  }, 
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('users')
      .returning('*')
      .then(([user]) => user)
  },

    validatePassword(user_password) {
      if (user_password.length < 8) {
        return 'Password must be longer than 8 characters'
      }
      if (user_password.length > 72) {
        return 'Password must be less than 72 characters'
      }
      if(user_password.startsWith(' ') || user_password.endsWith(' ')) {
        return 'Password must not start or end with empty spaces'
      }
      return null
    },
    hashPassword(user_password) {
      return bcrypt.hash(user_password, 12)
    },
    serializeUser(user) {
      return {
        id: user.id,
        user_name: xss(user.user_name),
        user_email: xss(user.user_email), 
      }
    },
  }
  
  module.exports = UsersService