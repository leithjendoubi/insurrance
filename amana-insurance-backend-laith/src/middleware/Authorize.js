import jwt from "jsonwebtoken";


const Authorize = (role=[]) => {
    return (req, res, next) => {
        const token = req.cookies.jwt
        if (!token) {
            return res.status(403).send({ message: "No token provided!" });
          }
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized!' })
            }
            req.username = decoded.UserInfo.username
            if(role.length && !role.includes(decoded.UserInfo.role)){
                return res.status(403).json({ message: "You don't have the access to use this functionality" })
            }
            next()
        })
    }

}

export default Authorize;