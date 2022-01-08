import jwt from 'jsonwebtoken';
import AdminAccount from '../models/adminAccount.model';
import Course from '../models/course.model';
import User from '../models/user.model';
import UsersCourses from '../models/usersCourses.model';


class AdminController {
    static create = async (req, res) => {
        res.status(200).send(req.user);
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

    static getInforAdmin = async (req, res) => {
        try {
            const user = await AdminAccount.findOne({
                where: { userName: req.user.userName },
                attributes: { exclude: ['password'] },
            })
            res.send(user)
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: 'Server Error!' })
        }
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

            const courses = await Course.findAll({raw:true});

            const obj = {};
            const userCourses = await UsersCourses.findAll({raw: true});
            userCourses.forEach(userCourse =>  {
                if(userCourse.studentId) {
                    if(!obj[userCourse.courseId]) {
                        obj[userCourse.courseId]= {countIsStudent:0,countIsTeacher:0}
                    }
                    obj[userCourse.courseId].countIsStudent++;
                } else {
                    if(!obj[userCourse.courseId]) {
                        obj[userCourse.courseId]=  {countIsStudent:0,countIsTeacher:0}
                    }
                    obj[userCourse.courseId].countIsTeacher++;
                }
            })

            res.status(200).send(courses.map(course => ({...course,countIsStudent: obj[course.id].countIsStudent || 0,countIsTeacher: obj[course.id].countIsTeacher || 0 })));
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

            const user = await User.findOne({
                attributes: { exclude: ['password'] },
                where: { id: userId },
                raw: true
            });
            if (user) {
                // eslint-disable-next-line no-unused-vars
                var { unMappedStudentId,...newUser } = user;
                if (!user.studentId && user.unMappedStudentId) {
                    newUser = { ...newUser, isMappedStudentId: false }
                } else if (user.studentId) {
                    newUser = { ...newUser, isMappedStudentId: true }
                }

                res.status(200).send(newUser);
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

            var users = await User.findAll({
                attributes: { exclude: ['password'] },
                paranoid: false,
                raw: true
            });
            const obj = {};
            const userCourses = await UsersCourses.findAll({raw: true});
            userCourses.forEach(userCourse =>  {
                if(userCourse.studentId) {
                    if(!obj[userCourse.studentId]) {
                        obj[userCourse.studentId]= {countIsStudent:0,countIsTeacher:0}
                    }
                    obj[userCourse.studentId].countIsStudent++;
                } else {
                    if(!obj[userCourse.teacherId]) {
                        obj[userCourse.teacherId]=  {countIsStudent:0,countIsTeacher:0}
                    }
                    obj[userCourse.teacherId].countIsTeacher++;
                }
            })
            users = users.map(user => {
                // eslint-disable-next-line no-unused-vars
                const { unMappedStudentId,...newUser } = user;
                const objRet = {...newUser,countIsStudent:obj[user.id]?.countIsStudent||0,countIsTeacher:obj[user.id]?.countIsTeacher||0 }
                if (!user.studentId && user.unMappedStudentId) {
                    objRet.isMappedStudentId = false
                } else if (user.studentId) {
                    objRet.isMappedStudentId = true
                }
                return objRet;
            })

            res.status(200).send(users);
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error')
        }
    }

    static banUser = async (req, res) => {
        try {
            const { userName } = req.user;
            console.log('req.body------------',req.body.id)

            if (!userName || !isAdmin(userName)) {
                res.status(200).send('You are not an admin');
                return;
            }

            const successValue = await User.destroy({
                where: {
                    id: req.body.id,
                },
            })

            if (successValue) {
                const deletedUser = await User.findAll({
                    attributes: { exclude: ['password'] },
                    where: {
                        id: req.body.id,
                    },
                    paranoid: false, // <<< It will retrieve soft-deleted record
                })
                res.status(200).send(deletedUser)
            } else {
                res.status(200).send({
                    message: `Can't found user with id ${req.body.id}.`,
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
            console.log('req.body------------',req.body)
            if (!userName || !isAdmin(userName)) {
                res.status(200).send('You are not an admin');
                return;
            }

            const users = await User.findAll({
                where: { id: req.body.id },
                paranoid: false,
            })
            if (!users) {
                res.status(200).send({ messsage: 'User does not exist' })
                return
            }
            for(let i = 0; i< users.length; ++i) {
               await users[i].restore();
            }
            res.status(200).send(users)
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

    static toggleStudentId = async (req, res) => {
        try {
            const { userName } = req.user;

            if (!userName || !isAdmin(userName)) {
                res.status(200).send('You are not an admin');
                return;
            }

            const { userId, isMappedStudentId } = req.body;

            var user = await User.findOne({
                where: { id: userId },
                raw: true
            })

            if (!user) {
                res.status(200).send({
                    message: 'User does not exist',
                })
                return;
            }

            if (isMappedStudentId === true && !user.studentId && user.unMappedStudentId) {
                user = {
                    ...user,
                    studentId: user.unMappedStudentId,
                    unMappedStudentId: null
                }
                const updatedUser = await User.update(user, {
                    where: {
                        id: user.id,
                    },
                    returning: true,
                    plain: true,
                })
                res.send({ message: "student id have been mapped", updatedUser })
                return;
            }
            if (isMappedStudentId === false && user.studentId) {
                user = {
                    ...user,
                    studentId: null,
                    unMappedStudentId: user.studentId
                }
                const updatedUser = await User.update(user, {
                    where: {
                        id: user.id,
                    },
                    returning: true,
                    plain: true,
                })
                res.send({ message: "student id have been unmapped", updatedUser })
                return;
            }
            res.send({ message: "nothing happened" });
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