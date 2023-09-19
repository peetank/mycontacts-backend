const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User" // providing reference of the model
    },
    name: {
        type: String,
        required: [true, "Please add the name"]
    },
    phone: {
        type: String,
        required: [true, "Please add phone no."]
    },
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Contact", contactSchema);