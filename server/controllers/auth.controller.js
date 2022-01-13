import jwt from 'jsonwebtoken'
import { verifyFb, verifyGg } from '../helpers/auth'
import User from '../models/user.model'
import {sendRewPassword} from '../utils/emailer.util'

class AuthController {
    static register = async (req, res) => {
        res.status(200).json({
            message: 'Signup successful',
            result: 1
        })
    }

    static login = async (req, res) => {
        const user = req.user

        const body = { id: user.id, email: user.mail }
        const token = jwt.sign({ user: body }, process.env.JWT_SECRET_KEY)
        res.json({
            message: 'Successfully log in',
            result: 1,
            content: { user },
            token,
        })
    }

    static socialLogin = async (req, res) => {
        try {
            let data
            if (req.body.fbToken) {
                data = await verifyFb(req.body.fbToken)
            }
            if (req.body.ggToken) {
                data = await verifyGg(req.body.ggToken)
            }
            console.log(data)

            if (data?.email === req.body.mail) {
                var user = await User.findOne({
                    where: { mail: req.body.mail },
                    paranoid: false
                })

                if (!user) {
                    user = this.createSocialAccount(
                        req.body.name,
                        req.body.mail
                    )
                } else if (user.deletedAt) {
                    res.status(200).send({ message: 'This account is banned' });
                    return;
                }

                req.user = user
                this.login(req, res)
            } else {
                res.status(200).send({
                    message: 'Invalid token',
                })
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Error server',
            })
        }
    }

    static createSocialAccount = async (name, mail) => {
        const newUser = {
            name: name,
            password: null,
            mail: mail,
            createdAt: Date(),
            updatedAt: Date(),
        }

        // Save User in the database
        const newRecord = await User.create(newUser);
        return newRecord;
    }

    static logout = async (req, res) => {
        req.logout()
        res.json({
            message: 'Logout successful',
        })
    }

    static renewPassword = async (req, res) => {
        try {
            const mail = req.body.mail;

            var user = await User.findOne({ where: { mail: mail }, paranoid: false })
            if (!user) {
                res.status(200).send({
                    message:
                        `Email didn't exist`,
                })
                return;
            } 

            if (user?.deletedAt) {
                res.status(200).send({ message: 'This email is banned' });
                return;
            }
            const newPassword = Math.random().toString(36).slice(-8);

            const hasedPass = await User.generateHash(newPassword);
            await User.update({password:hasedPass},{ where: { mail: mail }});
            sendRewPassword(req,res,user.name,newPassword);
            res.status(200).send({message: "reset password successfully"});
        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Error server',
            })
        }
    }

    static changePassword = async (req, res) => {
        try {
            const mail = req.user.email;

            var user = await User.findOne({ where: { mail }, paranoid: false })
            if (!user) {
                res.status(200).send({
                    message:
                        `Email didn't exist`,
                })
                return;
            } 

            if (user?.deletedAt) {
                res.status(200).send({ message: 'This email is banned' });
                return;
            }

            const {password, newPassword} = req.body;
            const isValidate = await User.isValidPassword(
                password,
                user.password
            )
            if (!isValidate) {
                res.status(200).send({message: "wrong password"});
                return;
            }

            const hasedPass = await User.generateHash(newPassword);
            await User.update({password:hasedPass},{ where: { mail: mail }});

            res.status(200).send({message: "change password successfully"});
        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Error server',
            })
        }
    }
}

export default AuthController;
