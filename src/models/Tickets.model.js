import mongoose from "mongoose";


const ticketSchema = new mongoose.Schema(
    {
        projectNumber: {
            type: String,
            required: true,
        },
        // dateTime: {
        //     type: Date,
        //     required: true,
        // },
        productName: {
            type: String,
            required: true,
            trim: true,
        },
        issueDetails: {
            type: String,
            required: true,
            trim: true,
        },
        issueType: {
            type: String,
            required: true,
            trim: true,
        },
        organization: {
            type: String,
            required: true,
            trim: true,
        },
        customerEmail: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["Live", "Resolved"],
            default: "Live",
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        comment: {
            type: String,
        },
        optionalEmail: {
            type: String,
            default: null,
        },
        synergyNumber: {
            type: String,
            default: null,
        },
        emailSent: {
            type: Boolean,
            default: false
        },
        replyDate: {
            type: Date
        },
    }, { timestamps: true })

export const Ticket = mongoose.model("Ticket", ticketSchema)