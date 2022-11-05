import mongoose from "mongoose";

const  ProductRequestSchema = new mongoose.Schema(
    {
        tillDate: {
            type: String,
            required:true
        },
        product: {
            _id:{
                type:String,
                required:true
            },
            name:{
                type:String,
                required:true
            },
            img:{
                type:String,
                required:true
            }
        },
        owner:{
            _id:{
                type:String,
                required:true
            },
            username:{
                type:String,
                required:true
            },
            avatar:{
                type:String,
                required:true
            },
        },
        userid: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        avatar:{
            type:String
        }
    },{timestamps:true}
)

const ProductRequest = mongoose.model("ProductRequest", ProductRequestSchema);

export default ProductRequest;