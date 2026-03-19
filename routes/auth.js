let express = require('express')
let router = express.Router()
let userController = require('../controllers/users')
let { RegisterValidator, validatedResult } = require('../utils/validator')
let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken')
const { check } = require('express-validator')
const { checkLogin } = require('../utils/authHandler')
const fs = require('fs')
const path = require('path')
// load private key for RS256 signing
const privateKey = fs.readFileSync(path.join(__dirname, '..', 'certs', 'private.key'))

router.post('/register', RegisterValidator, validatedResult, async function (req, res, next) {
    let { username, password, email } = req.body;
    let newUser = await userController.CreateAnUser(
        username, password, email, '69b2763ce64fe93ca6985b56'
    )
    res.send(newUser)
})
router.post('/login', async function (req, res, next) {
    let { username, password } = req.body;
    let user = await userController.FindUserByUsername(username);
    if (!user) {
        res.status(404).send({
            message: "thong tin dang nhap khong dung"
        })
        return;
    }
    if (!user.lockTime || user.lockTime < Date.now()) {
            if (bcrypt.compareSync(password, user.password)) {
            user.loginCount = 0;
            await user.save();
            let token = jwt.sign({
                id: user._id,
            }, privateKey, {
                algorithm: 'RS256',
                expiresIn: '1h'
            })
            res.send(token)
        } else {
            user.loginCount++;
            if (user.loginCount == 3) {
                user.loginCount = 0;
                user.lockTime = new Date(Date.now() + 60 * 60 * 1000)
            }
            await user.save();
            res.status(404).send({
                message: "thong tin dang nhap khong dung"
            })
        }
    } else {
        res.status(404).send({
            message: "user dang bi ban"
        })
    }

})
router.get('/me',checkLogin, function (req,res,next) {
    res.send(req.user)
})

// Change password (requires login)
router.post('/change-password', checkLogin,
    check('newpassword').isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    }).withMessage("password dai it nhat 8 ki tu, trong do co it nhat 1 ki tu hoa, 1 ki tu thuong, 1 ki tu so va 1 ki tu dac biet"),
    validatedResult,
    async function (req, res, next) {
        try {
            let { oldpassword, newpassword } = req.body;
            if (!oldpassword) return res.status(400).send({ message: 'oldpassword is required' });
            let user = req.user; // populated by checkLogin middleware
            if (!bcrypt.compareSync(oldpassword, user.password)) {
                return res.status(400).send({ message: 'old password is incorrect' });
            }
            user.password = newpassword;
            await user.save();
            res.send({ message: 'password changed' });
        } catch (error) {
            next(error);
        }
    }
)

module.exports = router;