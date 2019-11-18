import jwt from 'jsonwebtoken'


export default (token: string): any => new Promise (
    (resolve: Function, reject: Function) => {
        jwt.verify(token, process.env.JWT_SECRET || '', (err, decodedToken) => {
            if (err || !decodedToken)
                return reject(err)
            resolve(decodedToken)
        })
    }
)