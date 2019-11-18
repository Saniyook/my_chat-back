/**
 * Simle middleware to check is the user logged in and if he is put object
 * with info about him to request object
 */
import express from 'express'

import { verifyJWToken } from 'helpers'

export default (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    const token = req.headers.token
    if (
        req.path === '/user/signin' ||
        req.path === '/user/signup' ||
        req.path === '/user/verify'
    ) {
        return next()
    }
        

    if (!token || typeof token !== 'string')
        return res.status(403).json({
            message: 'Invalid or no auth token provided'
        })

    verifyJWToken(token)
        .then((user: any) => {
            req.user = user.data._doc
            next()
        })
        .catch((err: any) => {
            res.status(403).json({
                message: err
            })
        })

}