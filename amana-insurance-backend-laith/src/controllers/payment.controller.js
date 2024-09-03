import db from "../models/index.js";
import { Op } from "sequelize";
import paymentBillController from "./payment-bill.controller.js";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { model } from "mongoose";
const Payment = db.payment;

class PaymentController {
    async create(req, res) {
        try {
            const { state, bureauId, amount } = req.body;
            const bureau = await db.bureau.findOne({ where: { id: bureauId } });
            const totalDebts = bureau.totalDebts;
            const payment = await Payment.create({ state, bureauId, amount, totalDebts });
            await paymentBillController.uploadPaymentBill(req.file).then(async (paymentbill) => {
                await Payment.update({ paymentBillId: paymentbill.id }, { where: { id: payment.id } });
            });
            res.status(200).json(payment);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async getPaymentsByBureau(req, res) {
        try {
            const bureauId = req.params.id;
            const payments = await Payment.findAll({
                where: { bureauId },
                include: [{
                    model: db.bureau,
                    as: 'bureau',
                    include: [{
                        model: db.user,
                        as: 'director'
                    }],
                },
                {
                    model: db.paymentBill,
                    attributes: ['id', 'title', 'type','path'],
                    as: 'bill'
                }]
            });
            res.status(200).json(payments);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async getAll(req, res) {
        try {
            const payments = await Payment.findAll({
                include: [{
                    model: db.bureau,
                    as: 'bureau',
                    include: [{
                        model: db.user,
                        as: 'director'
                    }],
                },
                {
                    model: db.paymentBill,
                    attributes: ['id', 'title', 'type','path'],
                    as: 'bill'
                }
            ]
            });
            res.status(200).json(payments);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async search(req, res) {
        try {
            const { query } = req.params;
            const columns = Object.keys(payment.rawAttributes);
            const searchConditions = columns.map((column) => ({
                [column]: { [Op.like]: `%${query}%` },
            }));
            const payments = await Payment.findAll({ where: { [Op.between]: searchConditions } });
            res.status(200).json(payments);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async searchPaidPaymentsBetween(req, res) {
        try {
            const { startDate, endDate } = req.body;

            const sum = await Payment.sum('paidAmount', {
                where: {
                    [Op.and]: [
                        { startDate: { [Op.between]: [startDate, endDate] } },
                        { endDate: { [Op.between]: [startDate, endDate] } },
                        { state: 1 }
                    ]
                }
            });
            res.status(200).json(sum);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async getOne(req, res) {
        try {
            const id = req.params.id;
            const payment = await Payment.findOne({ where: { id },
                include : [{
                    model: db.paymentBill,
                    attributes: ['id', 'title', 'type','createdAt'],
                    as: 'bill'
                }]
            
            });
            res.status(200).json(payment);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    /* async getPaymentBill(req,res){
        try {
            const id = req.params.id;
            const payment = await Payment.findOne({ where: { id } });
            const paymentbill = await db.paymentBill.findOne({ where: { id: payment.paymentBillId } });
            res.setHeader('Content-Type', paymentbill.type);
            res.setHeader('Content-Disposition', 'attachment; filename=' + paymentbill.title);
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            const __directory = path.relative(__dirname ,__dirname + "/uploads/");
            res.end(__directory + paymentbill.path);
        } catch (err) {
            res.status(500).json(err);
        }
    } */

    /* async update(req, res) {
        try {
            const id = req.params.id;
            const payment = await Payment.update(req.body, { where: { id } });
            res.status(200).json(payment);
        } catch (err) {
            res.status(500).json(err);
        }
    } */

    async acceptPayment(req,res){
        try {
            const id = req.params.id;
            const myPayment = Payment.findOne({ where: { id } }).then(async (payment) => {
                await Payment.update({state:1}, { where: { id } }).then(async () => {
                    await db.bureau.update({totalDebts: payment.totalDebts - payment.amount}, { where: { id: payment.bureauId } });
                })
            })
            
            res.status(200).json(myPayment);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async rejectPayment(req,res){
        try {
            const id = req.params.id;
            const payment = await Payment.update({state:-1}, { where: { id } });
            res.status(200).json(payment);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async delete(req, res) {
        try {
            const id = req.params.id;
            await Payment.findOne({ where: { id }}).then(async (payment) => {
                await db.paymentBill.findOne({ where: { id: payment.paymentBillId }}).then(async (paymentbill) => {
                    const __filename = fileURLToPath(import.meta.url);
                    const __dirname = path.dirname(__filename);
                    const __directory = path.relative(__dirname ,__dirname);
                    fs.unlinkSync(__directory+paymentbill.path);
                    await db.paymentBill.destroy({ where: { id: payment.paymentBillId } }).then(async () => {
                        await Payment.destroy({ where: { id }});
                    })
                })
                
            })
            
            
            res.status(200).json({msg:"deleted successfully"});
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

export default new PaymentController;