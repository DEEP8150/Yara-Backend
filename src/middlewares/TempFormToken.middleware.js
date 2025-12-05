import jwt from "jsonwebtoken";
import TempToken from "../models/TempToken.js";

export const verifyTempToken = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        if (!auth || !auth.startsWith("Bearer "))
            return res.status(401).json({ message: "No temp token provided" });

        const token = auth.split(" ")[1];

        // check in DB
        const record = await TempToken.findOne({ token });
        if (!record) {
            return res.status(401).json({ message: "Invalid temp token" });
        }

        // check if already used
        if (record.used) {
            return res.status(401).json({ message: "Temp token already used" });
        }

        // verify expiration
        if (record.expiresAt < new Date()) {
            return res.status(401).json({ message: "Temp token expired" });
        }

        // verify signature
        const decoded = jwt.verify(token, process.env.TEMP_TOKEN_SECRET);

        req.tempToken = decoded; // userId, projectNumber, formName
        req.tempTokenRecord = record; // db record
        next();

    } catch (err) {
        return res.status(401).json({ message: "Unauthorized temp token", err });
    }
};
