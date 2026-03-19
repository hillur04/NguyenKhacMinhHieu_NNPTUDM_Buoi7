let jwt = require('jsonwebtoken')
let userController = require("../controllers/users")
const fs = require('fs')
const path = require('path')
const publicKey = fs.readFileSync(path.join(__dirname, '..', 'certs', 'public.key'))
module.exports = {
    checkLogin: async function (req, res, next) {
        try {
            let token = req.headers.authorization;
            if (!token || !token.startsWith('Bearer')) {
                return res.status(404).send("ban chua dang nhap")
            }
            token = token.split(" ")[1];
            let result = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
            let user = await userController.FindUserById(result.id);
            if (user) {
                req.user = user
                next()
            } else {
                res.status(404).send("ban chua dang nhap")
            }
        } catch (error) {
            res.status(404).send("ban chua dang nhap")
        }
    }
}