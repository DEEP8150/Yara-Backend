import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        projectNumber: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        productSerialNumber: {
            type: String,
            trim: true
        }

    }, { timestamps: true })

export const Purchase = mongoose.model("Purchase", purchaseSchema)