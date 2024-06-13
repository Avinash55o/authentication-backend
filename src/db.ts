import mongoose,{Document} from "mongoose";

interface IUser extends Document {
    email?: string;
    userName?: string;
    googleId?: string;
    password?: string;
    displayName?: string;
  }

const userSchema=new mongoose.Schema({
    userName: String,
    displayName:{type:String,
        unique:true
    },
    googleId:String,
    email:{type:String,
        unique:true
    },
    password:String
})

export const User = mongoose.model<IUser>('authusers',userSchema);


