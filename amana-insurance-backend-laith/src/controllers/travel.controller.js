import db from "../models/index.js";
import { Op } from "sequelize";
import { PdfGenerator } from "../helpers/pdfGenerator.js";
import { DebtsHelper } from "../helpers/debtsHelper.js";
const Travel = db.travel;

class TravelController {
  async create(req, res) {
    try {
      const travel = await Travel.create(req.body);
      const user = await db.user.findOne({ where: { id: travel.userId } });
      await DebtsHelper.calculateDebts(user.bureauId);
      res.status(200).json(travel);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  async getAll(req, res) {
    try {
      const travels = await Travel.findAll();
      res.status(200).json(travels);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async getAllByBureau(req, res) {
    try {
      const bureauId = req.params.id;
      const assurances = await Travel.findAll({
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
      const assurances = await Travel.findAll({ where: { userId } });
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

      const assurances = await Travel.findAll({
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
      const columns = Object.keys(Travel.rawAttributes);
      const searchConditions = columns.map((column) => ({
        [column]: { [Op.like]: `%${query}%` },
      }));
      const travels = await Travel.findAll({
        where: { [Op.or]: searchConditions },
      });
      res.status(200).json(travels);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  async getOne(req, res) {
    try {
      const id = req.params.id;
      const travel = await Travel.findOne({ where: { id } });
      res.status(200).json(travel);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  async update(req, res) {
    try {
      const id = req.params.id;
      const travel = await Travel.update(req.body, { where: { id } }).then(
        async () => {
          const myTravel = await Travel.findOne({ where: { id } });
          const user = await db.user.findOne({
            where: { id: myTravel.userId },
          });
          await DebtsHelper.calculateDebts(user.bureauId);
        }
      );

      res.status(200).json(travel);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  async delete(req, res) {
    try {
      const id = req.params.id;
      const myTravel = await Travel.findOne({ where: { id } });
      const travel = await Travel.destroy({ where: { id } });
      const user = await db.user.findOne({ where: { id: myTravel.userId } });
      await DebtsHelper.calculateDebts(user.bureauId);

      res.status(200).json(travel);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  async generatePdf(req, res) {
    try {
      const id = req.params.id;
      const travel = await Travel.findOne({
        where: { id: id },
        include: [
          {
            model: db.user,
            as: "user",
            include: [{ model: db.bureau, as: "bureau" }],
          },
        ],
      });
      const date1 = new Date(travel.dataValues.startDate);
      const date2 = new Date(travel.dataValues.endDate);
      const utcDate1 = Date.UTC(
        date1.getFullYear(),
        date1.getMonth(),
        date1.getDate()
      );
      const utcDate2 = Date.UTC(
        date2.getFullYear(),
        date2.getMonth(),
        date2.getDate()
      );
      const timeDifference = utcDate2 - utcDate1;
      const data = {
        id: travel.dataValues.createdAt.getTime(),
        bureau: travel.dataValues.user.dataValues.bureau.dataValues.name,
        today: new Date().toLocaleDateString().split("/").join("-"),
        name: travel.dataValues.name,
        birthDate: travel.dataValues.birthDate,
        sex: travel.dataValues.sex,
        numero_passport: travel.dataValues.numero_passport,
        address: travel.dataValues.address,
        phone: travel.dataValues.phone,
        nationalite: travel.dataValues.nationalite,
        startDate: travel.dataValues.startDate,
        endDate: travel.dataValues.endDate,
        nb_days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
        direction: travel.dataValues.direction,
        zone_couver: travel.dataValues.zone_couver,
        medical_coverage: "50,000 $",
        total: travel.dataValues.total,
      };
      const generator = new PdfGenerator();
      const pdf = await generator.execute(
        "./src/views/assurance-voyage.html",
        data
      );
      res.contentType("application/pdf");
      res.send(pdf);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

export default new TravelController();
