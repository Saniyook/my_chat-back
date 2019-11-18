import { Document } from 'mongoose';

    export default interface IUser extends Document {
        email: string,
        fullname: string,
        password: string,
        avatar?: string,
        confirmed: boolean,
        confirm_hash: string,
        last_seen: Date,
        color: string
    }
    
    export interface IUserLogin{
        email: string,
        password: string,
        [key: string]: string 
    }