import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js';

const verifyJWT = async (req , res , next) => {
    try {
        const authHeader = req.headers.authorization;

        const token = req.cookies?.accessToken || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null)

        if (!token){
            return res.status(401).json({message:"No token provided"})
        }

        const decodeToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodeToken?._id).select("-password -refreshToken");

        if (!user) {
            return res.status(401).json({message:"user not found"})
        }

        console.log("req.user",user)
        req.user = user
        next();

    } catch (error) {
        res.status(401).json({message: "Unauthorized",error})
    }
} 


const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied. Not allowed for this role." });
        }

        next();  
    };
};


export {verifyJWT  ,authorizeRoles}