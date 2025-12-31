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
        attachDocuments: [
            {
                url: String,
                uploadedAt: Date,
            }
        ],
        preDocs: {
            type: [
                {
                    title: String,
                    url: String,
                    formKey: String,
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
                    title: "Behavioural Observation Protocol",
                    formKey: "behavioural-observation",
                    isFilled: false,
                    s3PdfUrl: null,
                    filledByEngineer: null
                },
                {
                    title: "Annexure-6",
                    formKey: "annexure-6",
                    isFilled: false,
                    s3PdfUrl: null,
                    filledByEngineer: null
                },
                {
                    title: "Safety Walk On Site",
                    formKey: "safety-walk-on-site",
                    isFilled: false,
                    s3PdfUrl: null,
                    filledByEngineer: null
                }
            ]
        },

        postDocs: {
            type: [
                {
                    title: String,
                    url: String,
                    formKey: String,
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
                    formKey: "cold-commissioning",
                    isFilled: false,
                    s3PdfUrl: null,
                    filledByEngineer: null
                },
                {
                    title: "Hot Commissioning",
                    formKey: "hot-commissioning",
                    isFilled: false,
                    s3PdfUrl: null,
                    filledByEngineer: null
                },
                {
                    title: "ready to start protocol",
                    formKey: "ready-to-startup",
                    isFilled: false,
                    s3PdfUrl: null,
                    filledByEngineer: null
                }
            ]
        },


    }, { timestamps: true })

export const Purchase = mongoose.model("Purchase", purchaseSchema)