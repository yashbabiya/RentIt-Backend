import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
    {
        userid: {
            type: String,
            required: true
        },
        notification: [{
            title: {
                type: String,
                required: true,
                min: 5,
                max: 100
            },
            description: {
                type: String,
                required: true,
                min: 10
            },
            read: {
                type: Boolean,
                required: true,
                default: false
            }
        }]
    }
)

const Notification = mongoose.model("Notification", NotificationSchema);

export default Notification;