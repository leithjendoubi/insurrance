import TravelController from "../controllers/travel.controller.js";
import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import Authorize from "../middleware/Authorize.js";
import Role from "../helpers/Role.js";

const router = express.Router();

router.use(verifyJWT);
router.post("/add", TravelController.create);
router.get("/getall",Authorize([Role.Admin,Role.Finance]), TravelController.getAll);
router.get("/getallbybureau/:id",Authorize([Role.Admin,Role.Director,Role.Finance]), TravelController.getAllByBureau);
router.get("/getallbyuser/:id", TravelController.getAllByUser);
router.get("/search/:query", TravelController.search);
router.post("/rapport", TravelController.rapport);
router.get("/pdf/:id", TravelController.generatePdf);
router.get("/getone/:id", TravelController.getOne);
router.put("/update/:id", TravelController.update);
router.delete("/delete/:id", TravelController.delete);

export default router;