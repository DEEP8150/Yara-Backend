import mongoose from "mongoose";

const ticketCounterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    seq: {
        type: Number,
        default: 0,
    },
});

export const TicketCounter = mongoose.model("TicketCounter", ticketCounterSchema);
