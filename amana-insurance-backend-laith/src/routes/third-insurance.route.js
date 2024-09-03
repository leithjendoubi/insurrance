import ThirdInsurance from "../controllers/third-insurance.controller.js";
import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import Authorize from "../middleware/Authorize.js";
import Role from "../helpers/Role.js";

const router = express.Router();

router.use(verifyJWT);
router.post("/add", ThirdInsurance.create);
router.get("/getall",Authorize([Role.Admin,Role.Finance]), ThirdInsurance.getAll);
router.get("/getallbybureau/:id",Authorize([Role.Admin,Role.Director,Role.Finance]), ThirdInsurance.getAllByBureau);
router.get("/getallbyuser/:id", ThirdInsurance.getAllByUser);
router.post("/rapport", ThirdInsurance.rapport);
router.get("/search/:query", ThirdInsurance.search);
router.get("/pdf/:id",Authorize([Role.Director,Role.User]), ThirdInsurance.generatePdf);
router.get("/getone/:id", ThirdInsurance.getOne);
router.put("/update/:id", ThirdInsurance.update);
router.delete("/delete/:id", ThirdInsurance.delete);


export default router;