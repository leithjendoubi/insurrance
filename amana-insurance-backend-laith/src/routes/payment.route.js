import PaymentController from "../controllers/payment.controller.js";
import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import {uploadFile} from "../middleware/upload.js";

const router = express.Router();

router.use(verifyJWT);
router.post("/add", uploadFile.single("file"), PaymentController.create);
router.get("/getall", PaymentController.getAll);
router.get("/getallbybureau/:id", PaymentController.getPaymentsByBureau);
router.post("/searchpaiddebtsbetween", PaymentController.searchPaidPaymentsBetween);
router.get("/search/:query", PaymentController.search);
router.get("/getone/:id", PaymentController.getOne);
router.get("/accept-payment/:id", PaymentController.acceptPayment);
router.get("/reject-payment/:id", PaymentController.rejectPayment);
//router.get("/getPaymentBill/:id", PaymentController.getPaymentBill);
//router.put("/update/:id", PaymentController.update);
router.delete("/delete/:id", PaymentController.delete);

export default router