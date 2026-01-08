import mongoose ,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
export interface IUser {
    username: string;
    email: string;
    password: string;
    isVerified: boolean;
    refreshToken?: string;
    verificationToken?:string;
    verificationTokenExpiry?:Date;
    resetPasswordToken ?: string;
    resetPasswordExpiry ?: Date;
    resetPasswordRequestedAt?: Date;
    leetcodeHandle?: string;
    codeforcesHandle?: string;
    codechefHandle?: string;
    githubHandle?: string;
    avatar?: {
        url: string;
        publicId: string
    }
}
export interface IUserMethods{
    generateAccessToken(): string;
    generateRefreshToken():string
}

const userSchema = new Schema<IUser, mongoose.Model<IUser, {}, IUserMethods>, IUserMethods>({
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase:true
    },
    password:{
        type: String,
        required: true
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    refreshToken:{
        type: String
    },
    verificationToken:{
        type: String,
        default: undefined,
    },
    verificationTokenExpiry:{
        type: Date,
        default:undefined,
    },
    resetPasswordToken:{
        type: String,
        default:undefined
    },
    resetPasswordExpiry:{
        type: String,
        default: undefined
    },
    resetPasswordRequestedAt: {
        type: Date,
        default: undefined
    },
    leetcodeHandle: {
        type: String,
        trim: true
    },
    codeforcesHandle: {
        type: String,
        trim: true,
    },
    codechefHandle: {
        type: String,
        trim: true,
    },
    githubHandle: {
        type: String,
        trim: true,
    },
    avatar: {
    url: {
        type: String,
    },
    publicId: {
        type: String,
    },
}
},{timestamps:true})

userSchema.methods.generateAccessToken = function (): string {
    return jwt.sign(
        {userId: this._id},
        process.env.ACCESS_TOKEN_SECRET as string,
        {expiresIn:"15m"}
    );
};

userSchema.methods.generateRefreshToken = function (): string {
    return jwt.sign(
        {userId: this._id},
        process.env.REFRESH_TOKEN_SECRET as string,
        {expiresIn:"7d"}
    );
};
// this is mongoDB TTL index i.e time to live if unverified user exist on database 
userSchema.index(
    // sort in ascending order by time of creation
    {createdAt: 1},
    {
        expireAfterSeconds:3600,
        // only to delete when isVerified parameter is falsee
        partialFilterExpression: {isVerified:false}
    }
)

// export default mongoose.model<IUser>("User",userSchema);

export default  mongoose.model<IUser, mongoose.Model<IUser, {}, IUserMethods>>(
  "User",
  userSchema
);