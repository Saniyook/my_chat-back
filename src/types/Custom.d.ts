import { IUser, IConnections } from 'types';

declare global {
    namespace Express {
        export interface Request {
            user?: IUser
        }
    }
}

declare global {
    namespace NodeJS {
        interface Global {
            connections: IConnections
        }
    }    
  }