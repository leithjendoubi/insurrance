import express from 'express';
import SanteGroupeController from '../controllers/santeGroupe.controller.js';
import verifyJWT from '../middleware/verifyJWT.js';
import Authorize from "../middleware/Authorize.js";
import Role from '../helpers/Role.js';

const router = express.Router();

router.use(verifyJWT);
router.post('/add', SanteGroupeController.create);
router.get('/getall',Authorize([Role.Admin,Role.Finance]), SanteGroupeController.getAll);
router.get("/getallbybureau/:id",Authorize([Role.Admin,Role.Director,Role.Finance]), SanteGroupeController.getAllByBureau);
router.get("/getallbyuser/:id", SanteGroupeController.getAllByUser);
router.get("/search/:query", SanteGroupeController.search);
router.post("/rapport", SanteGroupeController.rapport);
router.get("/pdf/:id",Authorize([Role.Director,Role.User]), SanteGroupeController.generatePdf);
router.get('/getone/:id', SanteGroupeController.getOne);
router.put('/update/:id', SanteGroupeController.update);
router.delete('/delete/:id', SanteGroupeController.delete);

export default router;