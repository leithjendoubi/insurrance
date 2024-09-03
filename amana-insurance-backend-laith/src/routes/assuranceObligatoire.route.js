import AssuranceObligatoireController from "../controllers/asssuranceObligatoire.controller.js";
import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import Authorize from "../middleware/Authorize.js";
import Role from "../helpers/Role.js";

const router = express.Router();

router.use(verifyJWT);
router.post("/add", AssuranceObligatoireController.create);
router.get("/getall",Authorize([Role.Admin,Role.Finance]), AssuranceObligatoireController.getAll);
router.get("/getallbybureau/:id",Authorize([Role.Admin,Role.Director,Role.Finance]), AssuranceObligatoireController.getAllByBureau);
router.get("/getallbyuser/:id", AssuranceObligatoireController.getAllByUser);
router.get("/search/:query", AssuranceObligatoireController.search);
router.post("/rapport", AssuranceObligatoireController.rapport);
router.get("/getone/:id", AssuranceObligatoireController.getOne);
router.put("/update/:id", AssuranceObligatoireController.update);
router.get("/pdf/:id",Authorize([Role.Director,Role.User]), AssuranceObligatoireController.generatePdf);
router.delete("/delete/:id", AssuranceObligatoireController.delete);

export default router;