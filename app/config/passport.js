const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcrypt')

function init(passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        //Check if email exists
        const user = await User.findOne({ email: email })
        if (!user) {
            return done(null, false, { message: 'No user found with this email' })
        }

        // Match passwords if user already exists in the database
        bcrypt.compare(password, user.password).then(match => {
            if (match) {
                return done(null, user, { message: 'Logged successfully' })
            }
            return done(null, false, { message: 'Incorrect password' })
        }).catch(err => {
            return done(null, false, { message: 'Somthing went wrong' })
        })
    }))


    //If user is logged in then what needs to be stored in the session is mentioned here
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })


    //How to access the data that is stored in the session
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })




}

module.exports = init