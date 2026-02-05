import mongoose from "mongoose";

const ticketCounterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    seq: {
        type: Number,
        default: 0,
    },
});

ticketCounterSchema.index({ name: 1, year: 1 }, { unique: true });

export const TicketCounter = mongoose.model("TicketCounter", ticketCounterSchema);
