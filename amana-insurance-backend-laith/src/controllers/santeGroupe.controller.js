import db from "../models/index.js";
import { Op } from "sequelize";
import { PdfGenerator } from "../helpers/pdfGenerator.js";
import { DebtsHelper } from "../helpers/debtsHelper.js";
const SanteGroupe = db.santeGroupe;

class SanteGroupeController {
  async create(req, res) {
    try {
      const sante = await SanteGroupe.create(req.body);
      const user = await db.user.findOne({ where: { id: sante.userId } });
      await DebtsHelper.calculateDebts(user.bureauId);
      res.status(201).json(sante);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  async getAll(req, res) {
    try {
      const santes = await SanteGroupe.findAll();
      res.status(200).json(santes);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async getAllByBureau(req, res) {
    try {
      const bureauId = req.params.id;
      const assurances = await SanteGroupe.findAll({
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
      const assurances = await SanteGroupe.findAll({ where: { userId } });
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

      const assurances = await SanteGroupe.findAll({
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

  async search(req, res) {
    try {
      const { query } = req.params;
      const columns = Object.keys(SanteGroupe.rawAttributes);
      const searchConditions = columns.map((column) => ({
        [column]: { [Op.like]: `%${query}%` },
      }));
      const assurancesGroupe = await SanteGroupe.findAll({
        where: { [Op.or]: searchConditions },
      });
      res.status(200).json(assurancesGroupe);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async getOne(req, res) {
    try {
      const id = req.params.id;
      const sante = await SanteGroupe.findOne({ where: { id } });
      res.status(200).json(sante);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  async update(req, res) {
    try {
      const id = req.params.id;
      const sante = await SanteGroupe.update(req.body, { where: { id } }).then(
        async () => {
          const myGroupHealthInsurance = await SanteGroupe.findOne({ where: { id } });
          const user = await db.user.findOne({
            where: { id: myGroupHealthInsurance.userId },
          });
          await DebtsHelper.calculateDebts(user.bureauId);
        }
      );
      res.status(200).json(sante);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  async delete(req, res) {
    try {
      const id = req.params.id;
      const groupHealthInsurance = await SanteGroupe.findOne({ where: { id } });
      const sante = await SanteGroupe.destroy({ where: { id } });
      const user = await db.user.findOne({ where: { id: groupHealthInsurance.userId } });
      await DebtsHelper.calculateDebts(user.bureauId);
      res.status(200).json(sante);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async generatePdf(req, res) {
    try {
      const id = req.params.id;
      const sante = await SanteGroupe.findOne({
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
        id: sante.dataValues.createdAt.getTime(),
        bureau: sante.dataValues.user.dataValues.bureau.dataValues.name,
        today: new Date().toLocaleDateString().split("/").reverse().join("-"),
        startDate: sante.dataValues.startDate,
        endDate: sante.dataValues.endDate,
        name: sante.dataValues.name,
        address: sante.dataValues.address,
        phone: sante.dataValues.phone,
        capital_societe: sante.dataValues.capital_societe,
        tranche: sante.dataValues.tranche,
        initial: sante.dataValues.initial,
        taxe1: sante.dataValues.taxe1,
        taxe2: sante.dataValues.taxe2,
        taxe4: sante.dataValues.taxe4,
        total: sante.dataValues.total,
      };
      const generator = new PdfGenerator();
      const pdf = await generator.execute(
        "./src/views/assurance-sante-groupe.html",
        data
      );
      res.contentType("application/pdf");
      res.send(pdf);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

export default new SanteGroupeController();
