import mongoose, {Schema} from "mongoose";

const conceptSchema = new Schema(
    {
      user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
      },

      question:{
        type:String,
        required:true,
      },

      answer:{
        type:String,
        required:true,
      },
    },{
        timestamps:true,
    }
)

export const ConceptHistory = mongoose.model(
    "ConceptHistory",
    conceptSchema
);