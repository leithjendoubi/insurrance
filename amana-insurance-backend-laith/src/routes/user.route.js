import UserController from "../controllers/user.controller.js";
import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import Authorize from "../middleware/Authorize.js";
import Role from "../helpers/Role.js";

const router = express.Router();

//router.use(verifyJWT);
router.post("/add" /* ,Authorize([Role.Admin,Role.Director]) */  , UserController.create);
router.get("/getall",Authorize([Role.Admin,Role.Finance]), UserController.getAll);
router.get("/getallbybureau/:id",Authorize([Role.Admin,Role.Director,Role.Finance]), UserController.getAllByBureau);
router.get("/search/:query",Authorize([Role.Admin,Role.Director]), UserController.search);
router.post("/search-by-bureau/:query",Authorize([Role.Admin,Role.Director]), UserController.searchByBureau);
router.get("/getone/:id", UserController.getOne);
router.put("/update/:id",Authorize([Role.Admin,Role.Director]), UserController.update);
router.delete("/delete/:id",Authorize([Role.Admin,Role.Director]), UserController.delete);

export default router;