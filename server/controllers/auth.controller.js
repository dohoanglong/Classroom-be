import jwt from 'jsonwebtoken'

class auth {
    static register = async (req, res) => {
        res.json({
            message: 'Signup successful'
        })
    }

    static login = async (req, res) => {
        const user = req.user;
        console.log(user);
        const body = { id: user.id, email: user.mail };
        const token = jwt.sign({ user: body }, 'TOP_SECRET');
        res.json({
            token
        })
    }
}

export default auth;