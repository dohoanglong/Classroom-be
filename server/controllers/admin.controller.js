import jwt from 'jsonwebtoken';
import AdminAccount from '../models/adminAccount.model';
import Course from '../models/course.model';
import User from '../models/user.model';


class AdminController {
    static create = async (req, res) => {
        res.status(200).send({
            message: 'Signup successful',
        });
    }

    static logIn = async (req, res) => {
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

    static getClassDetail = async (req, res) => {
        try {
            const { userName } = req.user;
            const courseId = req.params.courseId;

            if (!userName || !isAdmin(userName)) {
                res.status(200).send('You are not an admin');
                return;
            }

            const course = await Course.findByPk(courseId);
            if (course) {
                res.status(200).send(course);
            } else {
                res.status(200).send({ message: 'course id does not exist' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error')
        }

    }

    static getAllClasses = async (req, res) => {
        try {
            const { userName } = req.user;

            if (!userName || !isAdmin(userName)) {
                res.status(200).send('You are not an admin');
                return;
            }

            const courses = await Course.findAll();

            res.status(200).send(courses);
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error')
        }

    }

    static getUserDetail = async (req, res) => {
        try {
            const { userName } = req.user;
            const userId = req.params.userId;

            if (!userName || !isAdmin(userName)) {
                res.status(200).send('You are not an admin');
                return;
            }

            const user = await User.findAll({
                attributes: { exclude: ['password'] },
                where: { id: userId }
            });
            if (user) {
                res.status(200).send(user);
            } else {
                res.status(200).send({ message: 'user id does not exist' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error')
        }
    }

    static getAllUsers = async (req, res) => {
        try {
            const { userName } = req.user;

            if (!userName || !isAdmin(userName)) {
                res.status(200).send('You are not an admin');
                return;
            }

            const users = await User.findAll({
                attributes: { exclude: ['password'] }
            });

            res.status(200).send(users);
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error')
        }
    }

    static banUser = async (req, res) => {
        try {
            const { userName } = req.user;

            if (!userName || !isAdmin(userName)) {
                res.status(200).send('You are not an admin');
                return;
            }

            const successValue = await User.destroy({
                where: {
                    id: req.params.userId,
                },
            })

            if (successValue) {
                const deletedUser = await User.findOne({
                    attributes: { exclude: ['password'] },
                    where: {
                        id: req.params.userId,
                    },
                    paranoid: false, // <<< It will retrieve soft-deleted record
                })
                res.status(200).send(deletedUser)
            } else {
                res.status(200).send({
                    message: `Can't found user with id ${req.params.userId}.`,
                })
            }
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error')
        }
    }

    static unbanUser = async (req, res) => {
        try {
            const { userName } = req.user;

            if (!userName || !isAdmin(userName)) {
                res.status(200).send('You are not an admin');
                return;
            }

            const user = await User.findOne({
                where: { id: req.params.userId },
                paranoid: false,
            })
            if (!user) {
                res.status(200).send({ messsage: 'User does not exist' })
                return
            }
            user.restore()
            res.status(200).send({ messsage: 'User unbanned' })
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error')
        }
    }

    static getAdminDetail = async (req, res) => {
        try {
            const { userName } = req.user;
            const adminUserName = req.params.userName;

            if (!userName || !isAdmin(userName)) {
                res.status(200).send('You are not an admin');
                return;
            }

            const admin = await AdminAccount.findOne({
                attributes: { exclude: ['password'] },
                where: { userName: adminUserName }
            });
            if (admin) {
                res.status(200).send(admin);
            } else {
                res.status(200).send({ message: 'user name does not exist' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error')
        }
    }

    static getAllAdmins = async (req, res) => {
        try {
            const { userName } = req.user;

            if (!userName || !isAdmin(userName)) {
                res.status(200).send('You are not an admin');
                return;
            }

            const admins = await AdminAccount.findAll({
                attributes: { exclude: ['password'] }
            });

            res.status(200).send(admins);
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error')
        }
    }
}

const isAdmin = async (userName) => {
    const adminAccount = await AdminAccount.findOne({ where: { userName } });

    if (adminAccount) {
        return true;
    }
    return false;
}

export default AdminController;