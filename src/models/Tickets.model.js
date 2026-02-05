import mongoose from "mongoose";
import { TicketCounter } from "./ticketCounter.js";


const ticketSchema = new mongoose.Schema(
    {
        ticketNumber: {
            type: Number,
        },
        formattedTicketId: {
            type: String,
            unique: true,
        },
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
        issue: {
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

        mobileNumber: {
            type: String,
            default: null,
        },
        issuedBy: {
            type: String,
            required: true,
            trim: true,
        },
        issuedByEmail: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        images: {
            type: [String],
            validate: {
                validator: function (arr) {
                    return !arr || arr.length <= 3;
                },
                message: "Maximum 3 images allowed",
            },
            default: [],
        },
        video: {
            type: String,
            default: null,
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


ticketSchema.pre("save", async function (next) {
    if (!this.isNew) return next();

    const year = new Date().getFullYear();
    const issueType = this.issueType.replace(/\s+/g, "").toUpperCase();

    const counter = await TicketCounter.findOneAndUpdate(
        { name: "ticket", year },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );

    this.ticketNumber = counter.seq;

    const padded = String(counter.seq).padStart(4, "0");

    this.formattedTicketId = `TKT_${year}_${issueType}_${padded}`;

    next();
});



export const Ticket = mongoose.model("Ticket", ticketSchema)