import db from "../models/index.js";
import { Op } from "sequelize";
const AssuranceObligatoire = db.assuranceOblig;
import { PdfGenerator } from "../helpers/pdfGenerator.js";
import {DebtsHelper} from "../helpers/debtsHelper.js";

class AssuranceObligatoireController {
  async create(req, res) {
    try {
      const assurance = await AssuranceObligatoire.create(req.body);
      const user = await db.user.findOne({ where: { id: assurance.userId } });
      await DebtsHelper.calculateDebts(user.bureauId);
      res.status(200).json(assurance);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  async getAll(req, res) {
    try {
      const assurances = await AssuranceObligatoire.findAll();
      res.status(200).json(assurances);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async getAllByBureau(req, res) {
    try {
      const bureauId = req.params.id;
      const assurances = await AssuranceObligatoire.findAll({
        include: [
          {
            model: db.user,
            as: "user",
            where: { bureauId },
            include: [{ model: db.bureau, as: "bureau" }],
          },
        ],
      });
      res.status(200).json(assurances);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async getAllByUser(req, res) {
    try {
      const userId = req.params.id;
      const assurances = await AssuranceObligatoire.findAll({
        where: { userId },
      });
      res.status(200).json(assurances);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async search(req, res) {
    try {
      const { query } = req.params;
      const columns = Object.keys(AssuranceObligatoire.rawAttributes);
      const searchConditions = columns.map((column) => ({
        [column]: { [Op.like]: `%${query}%` },
      }));
      const assurances = await AssuranceObligatoire.findAll({
        where: { [Op.or]: searchConditions },
      });
      res.status(200).json(assurances);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async rapport(req, res) {
    try {
      const searchColumns = [];
      Object.keys(req.body).forEach((key) => {
        if (
          req.body[key] != null &&
          key !== "startDate" &&
          key !== "endDate" &&
          key !== "bureauId"
        ) {
          searchColumns.push({ [key]: req.body[key] });
        }
      });
      if (req.body.startDate != null || req.body.endDate != null) {
        req.body.endDate === null
          ? searchColumns.push({
              startDate: { [Op.gte]: req.body.startDate },
            })
          : req.body.startDate === null
          ? searchColumns.push({
            startDate: { [Op.lte]: req.body.endDate },
          })
          : searchColumns.push({
              startDate: {
                [Op.between]: [req.body.startDate, req.body.endDate],
              },
            });
      }
      let searchConditions = {};
      req.body.bureauId
        ? (searchConditions = { bureauId: req.body.bureauId })
        : (searchConditions = {});
      /* if(req.body.bureauId!=null){
                
            } */
      /* if(searchColumns.length===0 && Object.keys(searchConditions).length===0){
                res.status(200).json([])
            } */

      const assurances = await AssuranceObligatoire.findAll({
        where: { [Op.and]: searchColumns },
        include: [
          {
            model: db.user,
            as: "user",
            where: [searchConditions],
            include: [{ model: db.bureau, as: "bureau" }],
          },
        ],
      });
      res.status(200).json(assurances);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  async getOne(req, res) {
    try {
      const id = req.params.id;
      const assurance = await AssuranceObligatoire.findOne({ where: { id } });
      res.status(200).json(assurance);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async update(req, res) {
    try {
      const id = req.params.id;
      const assurance = await AssuranceObligatoire.update(req.body, {
        where: { id },
      }).then(
        async () => {
          const myObligatoryInsurance = await AssuranceObligatoire.findOne({ where: { id } });
          const user = await db.user.findOne({
            where: { id: myObligatoryInsurance.userId },
          });
          await DebtsHelper.calculateDebts(user.bureauId);
        }
      );
      res.status(200).json(assurance);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  async delete(req, res) {
    try {
      const id = req.params.id;
      const myObligatoryInsurance = await AssuranceObligatoire.findOne({ where: { id } });
      const assurance = await AssuranceObligatoire.destroy({ where: { id } });
      const user = await db.user.findOne({ where: { id: myObligatoryInsurance.userId } });
      await DebtsHelper.calculateDebts(user.bureauId);
      res.status(200).json(assurance);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async generatePdf(req, res) {
    try {
      const id = req.params.id;
      const assuranceObligatoire = await AssuranceObligatoire.findOne({
        where: { id: id },
        include: [
          {
            model: db.user,
            as: "user",
            include: [{ model: db.bureau, as: "bureau" }],
          },
        ],
      });
      const data = {
        id: assuranceObligatoire.dataValues.createdAt.getTime(),
        bureau:
          assuranceObligatoire.dataValues.user.dataValues.bureau.dataValues
            .name,
        today: new Date().toLocaleDateString().split("/").reverse().join("-"),
        startDate: assuranceObligatoire.dataValues.startDate,
        endDate: assuranceObligatoire.dataValues.endDate,
        name: assuranceObligatoire.dataValues.name,
        address: assuranceObligatoire.dataValues.address,
        phone: assuranceObligatoire.dataValues.phone,
        type_car: assuranceObligatoire.dataValues.type_car,
        numero_serie: assuranceObligatoire.dataValues.numero_serie,
        numero_structure: assuranceObligatoire.dataValues.numero_structure,
        numero_moteur: assuranceObligatoire.dataValues.numero_moteur,
        Charge: assuranceObligatoire.dataValues.Charge,
        nb_passager: assuranceObligatoire.dataValues.nb_passager,
        annee_de_fabrication:
          assuranceObligatoire.dataValues.annee_de_fabrication,
        couleur: assuranceObligatoire.dataValues.couleur,
        Pays_de_fabrication:
          assuranceObligatoire.dataValues.Pays_de_fabrication,
        Orga_de_delivr: assuranceObligatoire.dataValues.Orga_de_delivr,
        initial: assuranceObligatoire.dataValues.initial,
        taxe1: assuranceObligatoire.dataValues.taxe1,
        taxe2: assuranceObligatoire.dataValues.taxe2,
        taxe3: assuranceObligatoire.dataValues.taxe3,
        taxe4: assuranceObligatoire.dataValues.taxe4,
        total: assuranceObligatoire.dataValues.total,
      };
      const generator = new PdfGenerator();
      const pdf = await generator.execute(
        "./src/views/assurance-obligatoire.html",
        data
      );
      res.contentType("application/pdf");
      res.send(pdf);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

export default new AssuranceObligatoireController();
