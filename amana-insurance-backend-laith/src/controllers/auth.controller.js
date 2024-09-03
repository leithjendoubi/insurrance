import db from "../models/index.js";
const User = db.user;
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { where } from "sequelize";

class AuthController {
  async login(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Please provide username and password" });
    }
    const foundedUser = await User.findOne({ where: { username } , include: [{model:db.bureau,as:"bureau"}] });
    if (!foundedUser || !foundedUser.active) {
      return res
        .status(404)
        .json({
          message: !foundedUser ? "utilisateur not found" : "user desactivated",
        });
    }
    const matchPassword = await bcrypt.compare(password, foundedUser.password);
    if (!matchPassword) {
      return res.status(401).json({ message: "password incorrect" });
    }
    //console.log(foundedUser)
    const accessToken = jwt.sign(
      { UserInfo: foundedUser },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      { UserInfo: foundedUser },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      SameSite: "None",
      secure: true,
    });
    
    res.json({ user:foundedUser,token:accessToken });
  }

  async refresh(req, res) {
    const cookies = req.cookies;
    if (!cookies.jwt) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const refreshToken = cookies.jwt;
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Forbidden" });
        }
        const foundUser = await User.findOne({
          username: decoded.UserInfo.username,
        });
        if (!foundUser) {
          return res.status(404).json({ message: "user not found" });
        }
        const accessToken = jwt.sign(
          { UserInfo: foundUser },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "7d" }
        );
        res.json({ accessToken });
      }
    );
  }

  async logout(req, res) {
    const cookies = req?.cookies;
    if (!cookies?.jwt) {
      return res.sendStatus(204);
    }
    else res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }).json({message:"logout successful"});
  }
}

export default new AuthController();
