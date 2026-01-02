// import jwt from "jsonwebtoken";
// import TempToken from "../models/TempToken.js";
// import { TempFormToken } from "../models/TempFormToken.model.js";

import { TempFormToken } from "../models/TempFormToken.model.js"
import jwt from "jsonwebtoken";
import { getObjectUrl } from "../utils/S3Client.js";
import { Purchase } from "../models/purchase.model.js";
import { Feedback } from "../models/feedback.model.js";


// export const verifyReactTempToken = async (req, res, next) => {
//     try {
//         const auth = req.headers.authorization;
//         if (!auth || !auth.startsWith("Bearer "))
//             return res.status(401).json({ message: "No temp token provided" });

//         const token = auth.split(" ")[1];

//         const decoded = jwt.verify(token, process.env.TEMP_TOKEN_SECRET);

//         const record = await TempFormToken.findOne({ token });

//         if (!record) {
//             return res.status(401).json({ message: "Invalid temp token" });
//         }

//         if (record.used) {
//             return res.status(401).json({ message: "Temp token already used" });
//         }

//         if (record.expiresAt < new Date()) {
//             return res.status(401).json({ message: "Temp token expired" });
//         }


//         req.tempToken = decoded; 
//         req.tempTokenRecord = record; 
//         next();

//     } catch (err) {
//         return res.status(401).json({ message: "Unauthorized temp token", err });
//     }
// };

export const validateTempToken = async (req, res) => {
    try {
        const tempToken =
            req.headers.authorization?.split(" ")[1] || req.query.token || req.headers.token;

        if (!tempToken)
            return res.status(401).json({ message: "Token missing" });

        const decoded = jwt.verify(tempToken, process.env.TEMP_TOKEN_SECRET);

        const dbToken = await TempFormToken.findOne({
            token: tempToken,
            used: false,

        });

        if (!dbToken)
            return res.status(401).json({
                message: "Token already used or expired",
                alreadySubmitted: true,

            });

        const purchase = await Purchase.findOne({ projectNumber: decoded.projectNumber });
        if (!purchase)
            return res.status(404).json({ message: "Project not found" });

        const FORM_GROUP_MAP = {
            "behavioural-observation": "preDocs",
            "annexure-6": "preDocs",
            "safety-walk-on-site": "preDocs",
            "cold-commissioning": "postDocs",
            "hot-commissioning": "postDocs",
            "ready-to-startup": "postDocs"
        };

        const docsKey = FORM_GROUP_MAP[decoded.formName];
        const doc = purchase[docsKey]?.find(d => d.formKey === decoded.formName);

        if (doc?.isFilled) {
            return res.json({
                valid: false,
                alreadySubmitted: true,
                projectNumber: decoded.projectNumber,
                formName: decoded.formName,
                message: "You already submitted this document"
            });
        }

        return res.json({
            valid: true,
            userId: decoded.userId,
            projectNumber: decoded.projectNumber,
            formName: decoded.formName,
            customerOrg: decoded.customerOrg,
            customerAddress: decoded.customerAddress,
            EngineerDetails: decoded.EngineerDetails,
            EngineerSignature: await getObjectUrl(decoded.EngineerSignature)
        });
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized", error: err.message });
    }
};


export const validateTempTokenMiddleware = async (req, res, next) => {
    try {
        const tempToken =
            req.headers.authorization?.split(" ")[1] || req.query.token || req.headers.token;


        if (!tempToken)
            return res.status(401).json({ message: "Token missing" });

        const decoded = jwt.verify(tempToken, process.env.TEMP_TOKEN_SECRET);


        const dbToken = await TempFormToken.findOne({
            token: tempToken,
            used: false
        });

        if (!dbToken)
            return res.status(401).json({ message: "Invalid or expired token" });

        req.user = {
            userId: decoded.userId,
            projectNumber: decoded.projectNumber,
            formName: decoded.formName,
            customerOrg: decoded.customerOrg,
            customerAddress: decoded.customerAddress,
            EngineerDetails: decoded.EngineerDetails,
            EngineerSignature: decoded.EngineerSignature
        };

        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized", error: err.message });
    }
};

export const validateFeedbackToken = async (req, res) => {
    try {
        const token =
            req.headers.authorization?.split(" ")[1] ||
            req.query.token ||
            req.params.token;

        if (!token) {
            return res.status(401).json({ message: "Token missing" });
        }

        const decoded = jwt.verify(token, process.env.FEEDBACK_TOKEN_SECRET);


        if (decoded.purpose !== "feedback") {
            return res.status(401).json({ message: "Invalid feedback token" });
        }

        const feedback = await Feedback.findOne({ tokenId: decoded.tokenId });

        return res.json({
            valid: true,
            projectNumber: decoded.projectNumber,
            userId: decoded.userId,
            customerOrg: decoded.customerOrg,
            customerAddress: decoded.customerAddress,
            status: feedback?.status || "PENDING"

        });

    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized",
            error: err.message
        });
    }
};

export const validateFeedbackTokenMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token missing" });
        }

        const decoded = jwt.verify(token, process.env.FEEDBACK_TOKEN_SECRET);

        const feedback = await Feedback.findOne({ tokenId: decoded.tokenId });

        if (!feedback) {
            return res.status(400).json({ message: "Invalid token" });
        }

        if (feedback.status === "SUBMITTED") {
            return res.status(409).json({ message: "Feedback already submitted" });
        }

        req.feedbackToken = decoded;
        req.feedbackDoc = feedback;

        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};


