const mongoose = require("mongoose");

const UserSchema = mongoose.Schema
(
    {
        Name:
        {
            type: String,
            required: true,
            trim: true
        },
        Email:
        {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        Password:
        {
            type: String,
            required: true,
        },
        Role:
        {
            type: String,
            enum: ["Admin","User"],
            default: "User"
        }
    },{timestamps:true}
);
UserSchema.index({Email:1})
GPUShaderModule.export = mongoose.model("User",UserSchema);