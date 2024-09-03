import express from 'express';
import SantePersonneController from '../controllers/santePersonne.controller.js';
import verifyJWT from '../middleware/verifyJWT.js';
import Authorize from "../middleware/Authorize.js";
import Role from '../helpers/Role.js';

const router = express.Router();

router.use(verifyJWT);
router.post('/add', SantePersonneController.create);
router.get('/getall',Authorize([Role.Admin,Role.Finance]), SantePersonneController.getAll);
router.get("/getallbybureau/:id",Authorize([Role.Admin,Role.Director,Role.Finance]), SantePersonneController.getAllByBureau);
router.get("/getallbyuser/:id", SantePersonneController.getAllByUser);
router.get("/search/:query", SantePersonneController.search);
router.post("/rapport", SantePersonneController.rapport);
router.get('/pdf/:id',Authorize([Role.Director,Role.User]), SantePersonneController.generatePdf);
router.get('/getone/:id', SantePersonneController.getOne);
router.put('/update/:id', SantePersonneController.update);
router.delete('/delete/:id', SantePersonneController.delete);

export default router;