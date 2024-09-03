import db from "../models/index.js";
const PaymentBill = db.paymentBill;

class PaymentBillController {
    async uploadPaymentBill(file) {
        try {
            const paymentbill = await PaymentBill.create({
                title: file.originalname,
                type: file.mimetype,
                path: file.path,
            })
            return paymentbill
        } catch (err) {
            return err;
        }
    }

    /* async getPaymentBillFile(req, res) {
        try {
            const id = req.params.id;
            const paymentbill = await PaymentBill.findByPk(id);
            res.setHeader('Content-Type', paymentbill.type);
            res.setHeader('Content-Disposition', 'attachment; filename=' + paymentbill.title);
            res.end(paymentbill.content);
        } catch (err) {
            res.status(500).json(err);
        }
    } */
}

export default new PaymentBillController();