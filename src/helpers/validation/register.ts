import { check } from 'express-validator'

export default [
    check('email').isEmail(),
    check('password').isLength({
        min: 8
    }),
    check('password').isLength({
        min: 3
    })
]