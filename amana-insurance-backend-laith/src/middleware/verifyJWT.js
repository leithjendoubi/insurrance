import jwt from 'jsonwebtoken'

const verifyJWT = (req, res, next) => {
    const token = req.cookies.jwt
    //console.log(req.cookies)
    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
      }
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized!' })
        }
        req.username = decoded.UserInfo.username
        next()
    })
}
export default verifyJWT