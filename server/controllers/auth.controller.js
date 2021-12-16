import jwt from 'jsonwebtoken'
import { verifyFb, verifyGg } from '../helpers/auth'
import User from '../models/user.model'

class AuthController {
    static register = async (req, res) => {
        res.status(200).json({
            message: 'Signup successful',
        })
    }

    static login = async (req, res) => {
        const user = req.user
        console.log(user)
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
                })

                if (!user) {
                    user = this.createSocialAccount(
                        req.body.name,
                        req.body.mail
                    )
                }

                req.user = user
                this.login(req, res)
            } else {
                res.status(400).send({
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
}

export default AuthController;
