import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    purchaseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Purchase",
        required: true
    },
    projectNumber: {
        type: String,
        required: true,
        index: true
    },
    fileName: {
        type: String,
        required: true
    },

    tokenId: {
        type: String,
        required: true,
        unique: true
    },

    s3PdfUrl: String,

    submittedAt: Date,

    status: {
        type: String,
        enum: ["PENDING", "SUBMITTED"],
        default: "PENDING"
    },
    totalScore: {
        type: Number,
        required: false
    },

    scorePercentage: {
        type: Number,
    },
    grade: {
        type: String,
        enum: ["A", "B", "C", "D"],
        required: false
    },

    gradeRange: {
        type: String,
        enum: ["80_OR_ABOVE", "51_79", "35_50", "35_OR_BELOW"],
        required: false,
        index: true
    },
    beforeSalesTotal: {
        type: Number,
        default: 0
    },
    executionTotal: {
        type: Number,
        default: 0
    },
    afterSalesTotal: {
        type: Number,
        default: 0
    },
    qualityTotal: {
        type: Number,
        default: 0
    },
    sectionPercentages: {
        beforeSales: Number,
        execution: Number,
        afterSales: Number,
        quality: Number,
    },
    worstSection: {
        type: String,
    },



}, { timestamps: true });

export const Feedback = mongoose.model("Feedback", feedbackSchema);
