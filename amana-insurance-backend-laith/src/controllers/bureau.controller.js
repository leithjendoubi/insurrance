import Role from "../helpers/Role.js";
import db from "../models/index.js";

const Bureau = db.bureau;
const User = db.user;
import { Op } from "sequelize";
import bcrypt from "bcrypt";

class BureauController {
  async create(req, res) {
    try {
      const {
        name,
        address,
        phone,
        gain_precentage_oblig,
        gain_precentage_travel,
        gain_precentage_third,
        gain_precentage_sante,
      } = req.body;

      const { username, password, hypervisorId } = req.body.director;
      const director_phone = req.body.director.phone;
      const director_address = req.body.director.address;
      const bureau = await Bureau.create({
        name,
        address,
        phone,
        gain_precentage_oblig,
        gain_precentage_travel,
        gain_precentage_third,
        gain_precentage_sante,
        totalDebts: 0,
      });
      const duplicate = await User.findOne({
        where: { username: username },
      });
      if (duplicate)
        {
          await Bureau.destroy({ where: { id: bureau.id } });
          return res.status(422).json({ message: "username already exist" });
        }
      else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
          username: username,
          password: hashedPassword,
          role: Role.Director,
          phone: director_phone,
          address: director_address,
          bureauId: bureau.id,
          hypervisorId,
        });
        Bureau.update({ directorId: user.id }, { where: { id: bureau.id } });
        res.status(200).json(bureau);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async getAll(req, res) {
    try {
      const bureaux = await Bureau.findAll();
      res.status(200).json(bureaux);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async search(req, res) {
    try {
      const { query } = req.params;
      const columns = Object.keys(Bureau.rawAttributes);
      const searchConditions = columns.map((column) => ({
        [column]: { [Op.like]: `%${query}%` },
      }));
      const bureaux = await Bureau.findAll({
        where: { [Op.or]: searchConditions },
      });
      res.status(200).json(bureaux);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async getOne(req, res) {
    try {
      const id = req.params.id;
      const bureau = await Bureau.findOne({
        where: { id },
        include: [{ model: db.user, as: "director" }],
      });
      res.status(200).json(bureau);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async update(req, res) {
    try {
      const id = req.params.id;
      const bureau = await Bureau.update(req.body, { where: { id } });
      res.status(200).json(bureau);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async delete(req, res) {
    try {
      const id = req.params.id;
      const bureau = await Bureau.destroy({ where: { id } });
      res.status(200).json(bureau);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async calculateDebts(req, res) {
    const bureauId = req.params.id;
    const bureau = await Bureau.findByPk(bureauId);
    const obligatoryInsurancesTotal = await db.assuranceOblig.sum("total", {
      include: [
        {
          model: db.user,
          attributes: [],
          as: "user",
          where: { bureauId },
        },
      ],
    });
    const thirdInsurancesTotal = await db.thirdInsurance.sum("total", {
      include: [
        {
          model: db.user,
          attributes: [],
          as: "user",
          where: { bureauId },
        },
      ],
    });
    const personHealthInsurancesTotal = await db.santePersonne.sum("total", {
      include: [
        {
          model: db.user,
          attributes: [],
          as: "user",
          where: { bureauId },
        },
      ],
    });
    const groupHealthInsurancesTotal = await db.santeGroupe.sum("total", {
      include: [
        {
          model: db.user,
          attributes: [],
          as: "user",
          where: { bureauId },
        },
      ],
    });
    const travelInsurancesTotal = await db.travel.sum("total", {
      include: [
        {
          model: db.user,
          attributes: [],
          as: "user",
          where: { bureauId },
        },
      ],
    });
    const totalPayments = await db.payment.sum("amount", {
      where: { bureauId },
    });
    const totalDebts =
      (obligatoryInsurancesTotal * (100 - bureau.gain_precentage_oblig)) / 100 +
      (travelInsurancesTotal * (100 - bureau.gain_precentage_travel)) / 100+
      (((groupHealthInsurancesTotal + personHealthInsurancesTotal) * (100 - bureau.gain_precentage_sante)) / 100)+
      ((thirdInsurancesTotal * (100 - bureau.gain_precentage_third)) / 100)
    //console.log(totalDebts)
    res.status(200).json({ total: (totalDebts - totalPayments) });
    //await db.bureau.update({ totalDebts }, { where: { id: bureauId } });
  }
}

export default new BureauController();
