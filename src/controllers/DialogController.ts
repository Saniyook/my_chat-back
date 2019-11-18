import express from 'express'
import socket from 'socket.io';


import { DialogModel, MessageModel } from 'models'
import { IDialog, IMessage, IUser } from 'types'


class DialogController {
    io: socket.Server;

    constructor(io: socket.Server) {
        this.io = io
    }

    index = (req: express.Request, res: express.Response): void => {
        
        const userId: string = req.user && req.user._id
        DialogModel
            .find({chatters: userId})
            .populate(['chatters'])
            .populate({
                path: 'lastMessage',
                populate: {
                    path: 'user'
                }
            })
            .exec((err: any, dialogs: any) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({
                        message: 'Server error',
                        err
                    })
                }

                if (!dialogs)
                    return res.json({
                        message: 'Dialogs no found'
                    })

                res.json(dialogs)
            })
    }


    create = (req: express.Request, res: express.Response): void => {

        if (req.user) {
            const postData = {
                chatters: [req.user._id, req.body.partner],
                text: req.body.text
            }
            
            const dialog = new DialogModel(postData)


            dialog.save()
                .then((dialog: any) => {
                    const message = new MessageModel({
                        text: postData.text,
                        user: postData.chatters[0],
                        dialog: dialog._id
                    })


                    message.save()
                        .then((message: IMessage) => {
                            dialog.lastMessage = message._id;
                            dialog.save().then(() => {
                                res.json(dialog);
                                this.io.emit('SERVER:DIALOG_CREATED', {
                                    ...postData,
                                    dialog: dialog,
                                });
                            });
                        })
                        .catch((err: any) => {
                            res.status(402).json(err)
                        })
                })
                .catch((err: any) => {
                    res.status(402).json(err)
                })
        }
        else res.status(403).json({
            message: 'Forbidden'
        })




    }
    /* 
        delete = ( req: express.Request, res: express.Response ) => {
            const id: string = req.params.id
            DialogModel.findByIdAndRemove(id).exec( (err: any, user: IDialog | null) => {
                if (err)
                    return res.status(404).json({
                        message: 'Oops, some error'
                    })
                else if (!user)
                    return res.json({
                        message: 'User not found'
                    })
                else res.json({
                   
                })
                
            })
        } */
}

export default DialogController