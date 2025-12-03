import mongoose from "mongoose";

const documentForm = new mongoose.Schema(
    {
        purchase: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Purchase",
            required: true,
        },
        formName: {
            type: String,
            required: true,
        },
        formLink: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["pre", "post"],
            required: true,
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export const DocumentForm = mongoose.model("DocumentForm", documentForm);
