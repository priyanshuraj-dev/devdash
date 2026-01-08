import mongoose, {Schema} from "mongoose";
export interface IProject{
    title: string;
    description: string;
    techStack: string[];
    images?: {
        url: string;
        publicId: string;
    }[];
    githubLink?: string;
    liveLink?: string;
    featured: boolean;
    owner: mongoose.Types.ObjectId
}

const ProjectSchema = new Schema<IProject>(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        techStack: {
            type: [String],
            required: true
        },
        images:[
            {
                url: {type: String, required: true},
                publicId: {type: String, required: true}
            }
        ],
        githubLink: {
            type: String
        },
        liveLink: {
            type: String
        },
        featured: {
            type:Boolean,
            default: false
        },
        owner:{
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
    },
    {timestamps: true}
)
export default mongoose.model<IProject>("Project",ProjectSchema)