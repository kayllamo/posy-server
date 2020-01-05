const express = require('express')
const path = require('path')
const UsersService = require('./user-service')
const usersRouter = express.Router()
const jsonBodyParser = express.json()


usersRouter
  .post('/', jsonBodyParser, (req, res, next) => {
    const { user_password, user_email, user_name } = req.body

      for (const field of ['user_name', 'user_email', 'user_password'])
      if (!req.body[field])
        return res.status(400).json({
            error: `Missing '${field}' in request body`
        })
    
        const passwordError = UsersService.validatePassword(user_password)

        if (passwordError) 
            return res.status(400).json({ error: passwordError})
        
        UsersService.hasUserWithUsername(
            req.app.get('db'),
            user_email
        )
        .then(hasUserWithUsername => {
            if (hasUserWithUsername)
                return res.status(400).json({ error: `Email already taken` })

                return UsersService.hashPassword(user_password)
                .then(hashedPassword => {
                    const newUser = {
                        user_email, 
                        user_name,
                        user_password: hashedPassword
                    }
            
                return UsersService.insertUser(
                    req.app.get('db'),
                    newUser
                )
                .then(user => {
                    res
                        .status(201)
                        .location(path.posix.join(req.originalUrl, `/${user.id}`))
                        .json(UsersService.serializeUser(user))
                })
        })
  })
  .catch(next)
})

module.exports = usersRouter;