import db from "../models/index.js";

const User = db.user;
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Role from "../helpers/Role.js";
import {Op} from "sequelize";

class UserController {
    async create(req, res) {
        try {
            
            const {username, password, phone, address} =
                req.body;
            const token = req.cookies.jwt;
            if (!token && req.body.role === Role.Admin) {
                const hashedPassword = await bcrypt.hash(password, 10);
                const user = await User.create({username, password:hashedPassword, role: Role.Admin, phone, address})
                res.status(200).json({user,message: "Administrateur créé avec succés"});
            } else {
                
                jwt.verify(
                    token,
                    process.env.REFRESH_TOKEN_SECRET,
                    async (err) => {
                        if (err) {
                            return res.status(403).json({message: "Forbidden"});
                        }
                        
                        const {bureauId,role,hypervisorId}= req.body
                        const duplicate = await User.findOne({
                            where: {username: req.body.username},
                        });
                        if (duplicate) return res.status(422).json({message: "username already exist"});
                        else {
                            const hashedPassword = await bcrypt.hash(password, 10);
                            const user = await User.create({
                                username,
                                password: hashedPassword,
                                role: role,
                                phone,
                                address,
                                bureauId,
                                hypervisorId
                            }); 
                            res.status(200).json(user);
                        }
                    })
            }
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async getAll(req, res) {
        try {
            const users = await User.findAll({include: [{model: db.bureau,as:"bureau"}]});
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async getAllByBureau(req, res) {
        try {
            const bureauId = req.params.id;
            const users = await User.findAll({where: {bureauId},include:[{model: db.bureau,as:"bureau"}]});
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async search(req, res){
        try{
            const {query} = req.params;
            const columns = Object.keys(User.rawAttributes);
            const searchConditions = columns.map((column) => ({
                [column]: { [Op.like]: `%${query}%` },
            }));
            const users = await User.findAll({where: {[Op.or]: searchConditions},include: [{model: db.bureau,as:"bureau"}]});
            res.status(200).json(users);
        }catch(err){
            res.status(500).json(err);
        }
    }

    async searchByBureau(req, res){
        try{
            const {query} = req.params;
            const {bureauId}=req.body;
            const columns = Object.keys(User.rawAttributes);
            const searchConditions = columns.map((column) => ({
                [column]: { [Op.like]: `%${query}%` },
            }));
            const users = await User.findAll({where: {[Op.and]:[{bureauId: bureauId}, {[Op.or]: searchConditions}]},include: [{model: db.bureau,as:"bureau"}]});
            res.status(200).json(users);
        }catch(err){
            res.status(500).json(err);
        }
    }



    async getOne(req, res) {
        try {
            const id = req.params.id;
            const user = await User.findOne({where: {id},include: [{model: db.bureau,as:'bureau'}]});
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async update(req, res) {
        try {
            const id = req.params.id;
            const user = await User.update(req.body, {where: {id}});
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async delete(req, res) {
        try {
            const id = req.params.id;
            const user = await User.destroy({where: {id}});
            res.status(200).json(user);
        } catch (err) {
            res.status(400).json(err);
        }
    }
}

export default new UserController();
