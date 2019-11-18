import bodyParser from 'body-parser';
import express from 'express'
import socket from 'socket.io'


import { updateLastSeen, checkAuth } from 'middleware'
import { UserController, DialogController, MessageController } from 'controllers'
import { loginValidator, registerValidator } from 'helpers/validation'

export default (app: express.Express,    io: socket.Server) => {
    global.connections = []
    app
        .use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        })
        .use(bodyParser.json())
        .use(checkAuth)
        .use(updateLastSeen)

    const
        User = new UserController(io),
        Dialog = new DialogController(io),
        Messages = new MessageController(io)



    //users
    app
        .get('/user/me', User.me)
        .get('/user/verify', User.verify)
        .post('/user/signup', registerValidator, User.signup)
        .post('/user/signin', loginValidator,User.signin)
        .get('/user/:id', User.get)
        .delete('/user/:id', User.delete)

    //dialogs
    app
        .get('/dialogs', Dialog.index)
        .post('/dialogs', Dialog.create)

    //messages  
    app
        .get('/messages', Messages.index)
        .post('/messages', Messages.create)
        .delete('/messages/:id', Messages.delete)

}