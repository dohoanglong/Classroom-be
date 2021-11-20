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
        const token = jwt.sign({ user: body }, process.env.JWT_SECRET_KEY);
        res.json({
            token
        })
    }

    static logout = async (req,res) => {
        req.logout();
        res.json({
            message: "Logout successful"
        })
    }
}

export default auth;