// import jwt from "jsonwebtoken";
// import TempToken from "../models/TempToken.js";
// import { TempFormToken } from "../models/TempFormToken.model.js";

import { TempFormToken } from "../models/TempFormToken.model.js"
import jwt from "jsonwebtoken";
import { getObjectUrl } from "../utils/S3Client.js";


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
            used: false
        });

        if (!dbToken)
            return res.status(401).json({ message: "Invalid or expired token" });

        return res.json({
            valid: true,
            userId: decoded.userId,
            projectNumber: decoded.projectNumber,
            formName: decoded.formName,
            customerOrg: decoded.customerOrg,
            engineerDetails: decoded.engineerDetails,
            EngineerSignature: await getObjectUrl(decoded.EngineerSignature)//decoded.EngineerSignature,
        });
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized", error: err.message });
    }
};


