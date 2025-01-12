const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const User = require('../models/user')

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const username = email
    User.findOne({ username }).then(user => {
        if (!user) {
            res.redirect('/login/student')
        }
        if (user.password === password) {
            req.session.userId = user._id
            req.session.email = user.username
            req.session.name = user.name
            res.redirect('/')
        } else {
            res.redirect('/login/student')
        }
    })

})

router.get('/logout', async (req, res) => {
    //session destroy
    req.session.userId = null

    res.redirect('/')
})



module.exports = router