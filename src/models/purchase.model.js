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
        },
        preDocs: {
            type: [
                {
                    title: String,
                    url: String,
                    isFilled: { type: Boolean, default: false },
                    s3PdfUrl: { type: String, default: null },
                    filledByEngineer: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User",
                        default: null
                    }
                }
            ],
            default: [
                {
                    title: "Cold Commissioning Activity list Protocol",
                    url: "http://192.168.1.223:5173/cold-commissioning",
                    isFilled: true,
                    s3PdfUrl: null
                },
                {
                    title: "Annexure 6.3.2.PSA13_Ready to Start Protocol",
                    url: "http://192.168.1.223:5173/hot-commissioning",
                    isFilled: false,
                    s3PdfUrl: null
                }
            ]
        },

        postDocs: {
            type: [
                {
                    title: String,
                    url: String,
                    isFilled: { type: Boolean, default: false },
                    s3PdfUrl: { type: String, default: null },
                    filledByEngineer: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User",
                        default: null
                    }
                }
            ],
            default: [
                {
                    title: "Behavioural observation​",
                    url: "http://192.168.1.223:5173/behavioural-observation",
                    isFilled: false,
                    s3PdfUrl: null
                },
            ]
        },
        feedbackForm: {
            type: [
                {
                    title: String,
                    url: String,
                    isFilled: { type: Boolean, default: false },
                    s3PdfUrl: { type: String, default: null },
                    filledByUser: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User",
                        default: null
                    }
                }
            ],
            default: [
                {
                    title: "Feedback Form",
                    url: "http://192.168.1.223:5173/feedback-form",
                    isFilled: false,
                    s3PdfUrl: null
                }
            ]
        }
    }, { timestamps: true })

export const Purchase = mongoose.model("Purchase", purchaseSchema)