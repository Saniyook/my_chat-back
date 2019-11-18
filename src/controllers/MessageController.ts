import express from 'express'
import socket from 'socket.io';

import { MessageModel, DialogModel } from 'models'
import { IMessage } from 'types'


class MessageController {
    io: socket.Server;

    constructor(io: socket.Server) {
        this.io = io
    }

    index = (req: express.Request, res: express.Response) => {
        if (req.user) {
            const dialogId: string = req.query.dialog

            MessageModel
                .find({ dialog: dialogId })
                .populate(['dialog', 'user'])
                .exec((err: any, messages: Array<IMessage>) => {
                    if (err)
                        return res.status(500)
                    
                    if (!messages.length) 
                        return res.json({
                            message: 'Messages not found'
                        })

                    res.json(messages)
                })
        }
    }


    create = (req: express.Request, res: express.Response) => {
        const userId = req.user && req.user._id
        console.log(req.user)
        const postData = {
            text: req.body.text,
            dialog: req.body.dialogId,
            user: userId
            // TODO attachments
            //attachments: req.body.attachments
        }
        const message = new MessageModel(postData)

        message.save()
            .then((message: any) => {
                message.populate(['dialog', 'user'], (err: any, message: any) => {
                    if (err) {
                        return res.status(500).json({
                            status: 'error',
                            message: err,
                        });
                    }
                    DialogModel.findOneAndUpdate(
                        { _id: postData.dialog },
                        { lastMessage: message._id },
                        { upsert: true },
                        function(err) {
                            if (err) {
                                return res.status(500).json({
                                    status: 'error',
                                    message: err,
                                });
                            }
                        },
                    );

                    res.json(message)

                    this.io.emit('SERVER:NEW_MESSAGE', message);
                })
                
                
            })
            .catch((err: any) => {
                console.log(err)
                res.json(err)
            })
    }

    delete = (req: express.Request, res: express.Response) => {
        const id: string = req.params.id
        MessageModel.findByIdAndRemove(id).exec((err: any, message: IMessage | null) => {
            if (err)
                return res.json({
                    message: err
                })
            else if (!message)
                return res.json({
                    message: 'Message not found'
                })
            else res.json({
                message: 'Message was removed'
            })

        })
    }
}

export default MessageController