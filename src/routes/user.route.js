import { Router } from "express";
import { authorizeRoles, verifyJWT } from "../middlewares/auth.middleware.js";
import { validateFeedbackToken, validateFeedbackTokenMiddleware, validateTempToken, validateTempTokenMiddleware } from "../middlewares/TempFormToken.middleware.js";
import { upload, uploadAttachDoc } from "../middlewares/multer.middleware.js";
import { DeleteAttachDocument, DeleteFeedbackDocument, deletePreOrPostDoc, generatePresignedUrlForPdf, getObjectPdf, uploadAttachDocument, uploadFeedbackForm, uploadPdf } from "../utils/S3Client.js";
import {
    addNewProduct, addProductToCustomer, changeCurrentPassword, createTicket, getCustomerDetailsAndPurchases, getTickets,
    getTicketById, login, logout, refreshAccessToken, registerCustomerAndEngineer, updateAssignedProduct, getAllCustomers,
    getAllEngineers, getAllPurchasedProductsOfCustomer, getAllProducts, updateNewProduct, ticketDetailsSendToParties, forgotPassword,
    resetNewPassword, getCustomerDetails, updateCustomer, getCustomerById, getUpdatedProduct, getEngineerById, updateEngineer, getAllPurchases,
    getAllProjectDocs, getPreDocs, getPostDocs, generateFormUrl, uploadSignature, getSignedImageUrl,
    sendFeedbackFormLink,
    markDocumentFilled,
    getAllDocumentsByProjectNumber,
    getAllAttachDocument,
    getAllFeedbacksFormsByProjectNumber,
    getFeedbackScoreForGraph,
    deleteProductFromCustomer,
    getFeedbackSectionGraph,
    getTicketsForGraph,
    deleteUserByAdmin,
    deleteProduct,
} from "../controllers/user.controller.js";


const userRouter = Router()

userRouter.route("/registerUser").post(verifyJWT, authorizeRoles("admin"), upload.single("signatureFile"), registerCustomerAndEngineer)
userRouter.route("/deleteUser/:userId").delete(verifyJWT, authorizeRoles("admin"), deleteUserByAdmin)
userRouter.route("/login").post(login)
userRouter.route("/logout").post(verifyJWT, logout)
userRouter.route("/change-password").post(verifyJWT, changeCurrentPassword)
userRouter.route("/refresh-AccessToken").post(verifyJWT, refreshAccessToken)

userRouter.route("/addNewProducts").post(verifyJWT, authorizeRoles("admin"), addNewProduct)
userRouter.route("/deleteProduct/:productId").delete(verifyJWT, authorizeRoles("admin"), deleteProduct)
userRouter.route("/products/:productId").patch(updateNewProduct)
userRouter.route("/:customerId/Add-products-Tocustomer").post(verifyJWT, authorizeRoles("admin"), addProductToCustomer)
userRouter.route("/:customerId/purchase/:purchaseId").delete(verifyJWT, authorizeRoles("admin"), deleteProductFromCustomer)
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
userRouter.route("/app-reset-password/:token").post(resetNewPassword)
userRouter.route("/products/:id").get(verifyJWT, getUpdatedProduct)

userRouter.route("/upload-signature").post(verifyJWT, uploadSignature)
userRouter.route("/signature-signed-url").get(getSignedImageUrl)
userRouter.route("/pdf-signed-url").post(generatePresignedUrlForPdf)
userRouter.route("/pdf-url").get(getObjectPdf)
userRouter.route("/upload-pdf").post(verifyJWT, uploadPdf)
//for unity:
userRouter.route("/unityAll-purchases").get(verifyJWT, getAllPurchases)
userRouter.route("/docs/:projectNumber").get(verifyJWT, getAllProjectDocs)
userRouter.route("/purchase/:projectNumber/pre-docs").get(verifyJWT, authorizeRoles("admin", "commissioning_engineer"), getPreDocs)
userRouter.route("/purchase/:projectNumber/post-docs").get(verifyJWT, authorizeRoles("admin", "commissioning_engineer"), getPostDocs)
userRouter.route("/feedback-form").post(verifyJWT, authorizeRoles("admin", "commissioning_engineer"), sendFeedbackFormLink)

userRouter.route("/generate-url").post(verifyJWT, authorizeRoles("admin", "commissioning_engineer"), generateFormUrl)
userRouter.route("/validate-temp-token").get(validateTempToken)
userRouter.route("/validate-feedback-token").get(validateFeedbackToken);
userRouter.route("/mark-document-filled").post(validateTempTokenMiddleware, markDocumentFilled);
userRouter.route("/project/:projectNumber/documents").get(verifyJWT, authorizeRoles("admin"), getAllDocumentsByProjectNumber);
userRouter.route("/purchase/attachDocument").post(verifyJWT, uploadAttachDoc.single("file"), uploadAttachDocument)
userRouter.route("/:userId/project/:projectNumber/attachDocuments").get(verifyJWT, getAllAttachDocument)
userRouter.route("/upload-feedback-form").post(validateFeedbackTokenMiddleware, upload.single("pdf"), uploadFeedbackForm)
userRouter.route("/delete-feedback-document/:id").delete(verifyJWT, authorizeRoles("admin"), DeleteFeedbackDocument)
userRouter.route("/project/:projectNumber/feedbacks").get(verifyJWT, authorizeRoles("admin"), getAllFeedbacksFormsByProjectNumber);
userRouter.route("/delete-AttachDocument/:id").delete(verifyJWT, authorizeRoles("admin"), DeleteAttachDocument)

userRouter.route("/delete-pre-post-doc/:purchaseId/:docId").delete(verifyJWT, authorizeRoles("admin"), deletePreOrPostDoc);

userRouter.route("/feedback-score-for-graph").get(verifyJWT, authorizeRoles("admin"), getFeedbackScoreForGraph);
userRouter.route("/feedback-section-graph").get(verifyJWT, authorizeRoles("admin"), getFeedbackSectionGraph);
userRouter.route("/tickets-for-graph").get(verifyJWT, authorizeRoles("admin"), getTicketsForGraph);






// userRouter.route("/pre-documentUpdate/:projectNumber/:index").post(verifyJWT, authorizeRoles("admin", "commissioning_engineer"), updatePreDocStatus)

export default userRouter