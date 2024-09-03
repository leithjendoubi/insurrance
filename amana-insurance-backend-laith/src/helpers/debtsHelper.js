import db from "../models/index.js";

export const DebtsHelper = {
  async calculateDebts(bureauId) {
    const bureau = await db.bureau.findByPk(bureauId);
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
    await db.bureau.update({ totalDebts : (totalDebts - totalPayments) }, { where: { id: bureauId } });
  },
};
