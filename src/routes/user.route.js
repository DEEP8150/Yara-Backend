import { Router } from "express";
import {
    addNewProduct, addProductToCustomer, changeCurrentPassword, createTicket, getCustomerDetailsAndPurchases, getTickets,
    getTicketById, login, logout, refreshAccessToken, registerCustomerAndEngineer, updateAssignedProduct, getAllCustomers,
    getAllEngineers, getAllPurchasedProductsOfCustomer, getAllProducts, updateNewProduct, ticketDetailsSendToParties, forgotPassword,
    resetNewPassword,
    getCustomerDetails,
    updateCustomer,
    getCustomerById,
    getUpdatedProduct,
    getEngineerById,
    updateEngineer
} from "../controllers/user.controller.js";

import { isAdmin, verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router()

userRouter.route("/registerUser").post(registerCustomerAndEngineer)
userRouter.route("/login").post(login)
userRouter.route("/logout").post(verifyJWT, logout)
userRouter.route("/change-password").post(verifyJWT, changeCurrentPassword)
userRouter.route("refresh-AccessToken").post(refreshAccessToken)

userRouter.route("/addNewProducts").post(verifyJWT, isAdmin, addNewProduct)
userRouter.route("/products/:productId").patch(updateNewProduct)
userRouter.route("/:customerId/Add-products-Tocustomer").post(verifyJWT, isAdmin, addProductToCustomer)
userRouter.route("/:userId/purchase/:purchaseId").patch(verifyJWT, isAdmin, updateAssignedProduct)
userRouter.route("/:userId/purchase").get(verifyJWT, getCustomerDetailsAndPurchases)
userRouter.route("/raiseTicket").post(verifyJWT, createTicket)
userRouter.route("/getTickets").get(verifyJWT, getTickets)
userRouter.route("/:ticketId/ticket").get(verifyJWT, getTicketById)
userRouter.route("/all-customers").get(verifyJWT, getAllCustomers)
userRouter.route("/allCommissingEngineer").get(verifyJWT, getAllEngineers)
userRouter.route("/customer/:customerId/purchases").get(getAllPurchasedProductsOfCustomer)
userRouter.route("/all-products").get(getAllProducts)
userRouter.route("/customer/:userId").get(getCustomerDetails);
userRouter.route("/updateCustomer/:userId").patch(updateCustomer);
userRouter.route("/getUpdateCustomer/:userId").get(getCustomerById);
userRouter.route("/engineers/:id").get(getEngineerById);
userRouter.route("/engineers/:id").patch(updateEngineer);

userRouter.route("/tickets/:ticketId/action").post(verifyJWT,isAdmin,ticketDetailsSendToParties)
userRouter.route("/forgot-password").post(forgotPassword)
userRouter.route("/reset-password/:token").post(resetNewPassword)
userRouter.route("/products/:id").get(getUpdatedProduct)



export default userRouter