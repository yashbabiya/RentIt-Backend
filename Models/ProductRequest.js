import mongoose from "mongoose";

const  ProductRequestSchema = new mongoose.Schema(
    {
        message: {
            type: String,
            max: 100
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
            type:string
        }
    },{timestamps:true}
)

const ProductRequest = mongoose.model("ProductRequest", ProductRequestSchema);

export default ProductRequest;