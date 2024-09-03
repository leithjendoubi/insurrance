import BureauController from "../controllers/bureau.controller.js";
import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import Authorize from "../middleware/Authorize.js";
import Role from "../helpers/Role.js";

const router = express.Router();

router.use(verifyJWT);
router.post("/add",Authorize([Role.Admin]), BureauController.create);
router.get("/getall",Authorize([Role.Admin,Role.Director,Role.Finance]), BureauController.getAll);
router.get("/search/:query",Authorize([Role.Admin,Role.Finance]), BureauController.search);
router.get("/getone/:id", BureauController.getOne);
router.get("/calculateDebts/:id", BureauController.calculateDebts);
router.put("/update/:id",Authorize([Role.Admin]), BureauController.update);
router.delete("/delete/:id",Authorize([Role.Admin]), BureauController.delete);


export default router;