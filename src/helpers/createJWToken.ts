import jwt from 'jsonwebtoken'
import {reduce } from 'lodash'

import { IUserLogin } from 'types';  

interface StringMap { [key: string]: string | boolean | Date; }

export default (user: IUserLogin) =>  {
    const token =jwt.sign(
        {
           data: reduce(user, (result: StringMap, curVal, key) => {
            if (key !== 'password') {
                result[key] = curVal
            }
            return result
           },{}) 
        },
        process.env.JWT_SECRET || '',
        {
            expiresIn: '7d',
            algorithm: 'HS256'
        }
    )

    return token
}