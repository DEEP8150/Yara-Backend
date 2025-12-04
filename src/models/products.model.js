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

        },

        childrenProducts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],


        isVisibleInMobile: {
            type: Boolean,
            default: false
        }
    }, { timestamps: true })

export const Product = mongoose.model("Product", productSchema) 