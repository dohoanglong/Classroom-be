import jwt from 'jsonwebtoken';
import AdminAccount from '../models/adminAccount.model';


class AdminController {
    static create = async (req,res) => {
        res.status(200).send({
            message: 'Signup successful',
        });
    }

    static logIn = async (req,res) => {
        const user = req.user

        const body = { id: user.id, userName: user.userName }
        const token = jwt.sign({ user: body }, process.env.JWT_SECRET_KEY)
        res.json({
            message: 'Successfully log in',
            result: 1,
            content: { user },
            token,
        })
    }
}

export default AdminController;