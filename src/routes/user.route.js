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
    updateEngineer,
    getAllPurchases,
    getAllProjectDocs,
    getPreDocs,
    getPostDocs,
    generateFormUrl
} from "../controllers/user.controller.js";

import { authorizeRoles, verifyJWT } from "../middlewares/auth.middleware.js";
import { validateTempToken } from "../middlewares/TempFormToken.middleware.js";

const userRouter = Router()

userRouter.route("/registerUser").post(verifyJWT, authorizeRoles("admin"), registerCustomerAndEngineer)
userRouter.route("/login").post(login)
userRouter.route("/logout").post(verifyJWT, logout)
userRouter.route("/change-password").post(verifyJWT, changeCurrentPassword)
userRouter.route("/refresh-AccessToken").post(verifyJWT, refreshAccessToken)

userRouter.route("/addNewProducts").post(verifyJWT, authorizeRoles("admin"), addNewProduct)
userRouter.route("/products/:productId").patch(updateNewProduct)
userRouter.route("/:customerId/Add-products-Tocustomer").post(verifyJWT, authorizeRoles("admin"), addProductToCustomer)
userRouter.route("/:userId/purchase/:purchaseId").patch(verifyJWT, authorizeRoles("admin"), updateAssignedProduct)
userRouter.route("/:userId/purchase").get(verifyJWT, authorizeRoles("admin", "commissioning_engineer"), getCustomerDetailsAndPurchases)
userRouter.route("/raiseTicket").post(verifyJWT, createTicket)
userRouter.route("/getTickets").get(verifyJWT, getTickets)
userRouter.route("/:ticketId/ticket").get(verifyJWT, authorizeRoles("admin"), getTicketById)
userRouter.route("/all-customers").get(verifyJWT, authorizeRoles("admin", "commissioning_engineer"), getAllCustomers)
userRouter.route("/allCommissingEngineer").get(verifyJWT, authorizeRoles("admin"), getAllEngineers)
userRouter.route("/customer/:customerId/purchases").get(verifyJWT, getAllPurchasedProductsOfCustomer)
userRouter.route("/all-products").get(verifyJWT, authorizeRoles("admin", "commissioning_engineer"), getAllProducts)
userRouter.route("/customer/:userId").get(verifyJWT, getCustomerDetails);
userRouter.route("/updateCustomer/:userId").patch(verifyJWT, authorizeRoles("admin"), updateCustomer);
userRouter.route("/getUpdateCustomer/:userId").get(getCustomerById);
userRouter.route("/engineers/:id").get(verifyJWT, getEngineerById);
userRouter.route("/engineers/:id").patch(verifyJWT, authorizeRoles("admin"), updateEngineer);

userRouter.route("/tickets/:ticketId/action").post(verifyJWT, authorizeRoles("admin", "commissioning_engineer"), ticketDetailsSendToParties)
userRouter.route("/forgot-password").post(forgotPassword)
userRouter.route("/reset-password/:token").post(resetNewPassword)
userRouter.route("/products/:id").get(verifyJWT, getUpdatedProduct)

//for unity:
userRouter.route("/unityAll-purchases").get(verifyJWT, getAllPurchases)
userRouter.route("/docs/:projectNumber").get(verifyJWT, getAllProjectDocs)
userRouter.route("/purchase/:projectNumber/pre-docs").get(verifyJWT, getPreDocs)
userRouter.route("/purchase/:projectNumber/post-docs").get(verifyJWT, getPostDocs)

userRouter.route("/generate-url").post(verifyJWT, generateFormUrl)
userRouter.route("/validate-temp-token").get(validateTempToken)

// userRouter.route("/pre-documentUpdate/:projectNumber/:index").post(verifyJWT, authorizeRoles("admin", "commissioning_engineer"), updatePreDocStatus)

export default userRouter