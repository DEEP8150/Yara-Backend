import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import crypto from "crypto";

const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            trim: true
        },
        lastName: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
            lowercase: true
        },
        address_1: {
            type: String,
        },
        address_2: {
            type: String,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
            enum: ["admin", "customer", "commissioning_engineer"],
            default: "customer"
        },
        organization: {
            type: String,
        },
        country: {
            type: String,
            trim: true,
            required: true
        },
        pinNumber: {
            type: String
        },
        phoneNumber: {
            type: String,
            required: true
        },
        refreshToken: {
            type: String
        },
        resetPasswordToken: {
            type: String,
        },
        resetPasswordExpiry: {
            type: Date
        },
    }, { timestamps: true })

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next()

    this.password = await bcrypt.hash(this.password, 15)
    next()
})

UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

UserSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        role: this.role,
        email: this.email,
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
}

UserSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,

    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY })
}

UserSchema.methods.generatePasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

    return resetToken;
};

export const User = mongoose.model("User", UserSchema)