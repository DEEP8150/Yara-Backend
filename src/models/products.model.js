import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: true,
            trim: true
        },
        productDetails: {
            type: String,

        }
    }, { timestamps: true })

export const Product = mongoose.model("Product", productSchema) 