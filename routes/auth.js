const express = require('express')
const router = express.Router()

const User = require('../models/user')

router.post('/login', async (req, res) => {
    const { email, password } = req.body

    // verifica na db

    user.findOne({ email }, (err, user) => {
        if (err) {
            return res.status(500).send()
        }

        if (!user) {
            return res.status(404).send()
        }

        req.session.userId = user._id
        res.status(200).send()
    })
})

router.post('/logout', async (req, res) => {
    req.session.userId = null
    res.redirect('/')
})

router.get('/login/student', async (req, res) => {
    res.render('login', { user_role: 'student' })
})

module.exports = router