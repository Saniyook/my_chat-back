import express from 'express'
import bcrypt from 'bcrypt'
import socket from 'socket.io';
import { validationResult } from 'express-validator';


import { UserModel } from 'models'
import { IUser, IUserLogin } from 'types'
import {createJWToken} from 'helpers'



class UserController {
    io: socket.Server;
    
    constructor (io: socket.Server) {
        this.io = io
    }

    get = (req: express.Request, res: express.Response) => {
        const id: string = req.params.id
        UserModel.findById(id).exec((err: any, user: IUser | null) => {
            if (err)
                return res.status(404).json({
                    message: 'Not found'
                })
            res.json(user)
        })
    }

    me = (req: express.Request, res: express.Response) => {
        const id: string = req.user && req.user._id
        UserModel.findById(id).exec((err: any, user: IUser | null) => {
            if (err)
                return res.status(404).json({
                    message: 'Not found'
                })
            res.json(user)
        })
    }

    signup = (req: express.Request, res: express.Response) => {

        const postData = {
            email: req.body.email,
            fullname: req.body.fullname,
            password: req.body.password,
        }

        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(422).json({
                errors: errors.array()
            })
            
        const user = new UserModel(postData)

        UserModel
            .findOne({email: postData.email})
            .exec((err: any, userObj: IUser) => {
                if (err)
                    return res.status(500)

                if (userObj)
                    res.json({
                        status: 'error',
                        message: 'Account is already exist please log in'
                    })
                
                if (!userObj)
                    user.save()
                    .then((user: IUser) => {
                        res.json(user)
                    })
                    .catch((err: any) => {
                        res.json(err)
                    })
                
            })

    }

    verify = (req: express.Request, res: express.Response) => {
        const hash = req.query.hash
        
        if (!hash) {
            return res.status(400)
        }

        UserModel
            .findOne({confirm_hash: hash})
            .exec((err:any, user: IUser) => {
                
                if (err)
                    return res.status(500)

                if (!user)
                    return res.json({
                        status: 'error',
                        message: 'Not found'
                    })
                
                user.confirmed = true
                user.save()
                    .then(() => {
                        res.json({
                            status:'success',
                            message:'Account successfully confirmed'
                        })
                    })

            })
    }

    delete = (req: express.Request, res: express.Response) => {
        const id: string = req.params.id
        UserModel.findByIdAndRemove(id).exec((err: any, user: IUser | null) => {
            if (err)
                return res.status(404).json({
                    message: 'Oops, some error'
                })
            else if (!user)
                return res.json({
                    message: 'User not found'
                })
            else res.json({
                message: `User ${user.fullname} was removed`
            })

        })
    }

    signin = (req: express.Request, res: express.Response) => {
        const postData = {
            email: req.body.email,
            password: req.body.password
        }
        const regex = new RegExp(['^',postData.email,'$'].join(''), 'i')
        UserModel.findOne({ email: regex }, (err, user: any) => {
            if (err) 
                return res.status(500).json({
                    status:'error',
                    message: 'Oops, some server error...'
                })
            
            if (!user)
                return res.json({
                    status:'warning',
                    message: 'No account found, create new one right now!'
                 })

            if (bcrypt.compareSync(postData.password, user.password)) {
                const token = createJWToken(user)
                
                res.json({
                    status: 'success',
                    token
                })
            } else {
                res.json({
                    status: 'error',
                    message: 'Incorrect password or email'
                })
            }
        })
    }
}

export default UserController