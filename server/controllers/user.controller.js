/* eslint-disable no-unused-vars */
import User from '../models/user.model'
import { verifyFb, verifyGg } from '../helpers/auth'
import { Op } from 'sequelize'

class UserController {
    static create = async (req, res, next, isFromSocial = false) => {
        try {
            if (!req.body) {
                res.status(200).send({
                    message: 'Content can not be empty!',
                })
            }
            //   check if exist mail
            const user = await User.findOne({ where: { mail: req.body.mail } })

            if (user) {
                res.status(200).send({
                    message: 'Existed mail',
                    result: 0,
                    content: null,
                })
            }
            // Create a User
            let encrytedPassword = null
            if (!isFromSocial) {
                encrytedPassword = await User.generateHash(req.body.password)
            }
            // Validate request
            const newUser = {
                name: req.body.name,
                password: encrytedPassword,
                mail: req.body.mail,
                createdAt: Date(),
                updatedAt: Date(),
            }

            // Save User in the database
            const newRecord = await User.create(newUser)
            res.send({
                message: 'Successfully created account',
                result: 1,
                content: { user: newRecord },
            })
        } catch (e) {
            console.log('er: ', e)
            res.status(500).send({
                message: 'Error server ',
            })
        }
    }

    // Find a single user
    static findOne = async (req, res, next, isFromSocial = false) => {
        try {
            const user = await User.findOne({ where: { mail: req.body.mail } })
            if (!isFromSocial) {
                if (!user)
                    res.status(200).send({
                        message: 'Non existed mail',
                        result: 0,
                        content: null,
                    })
                if (user.password !== req.body.password) {
                    res.status(200).send({
                        message: 'Wrong password',
                        result: 0,
                        content: null,
                    })
                } else
                    res.status(200).send({
                        message: 'Successfully log in',
                        result: 1,
                        content: { user },
                    })
            } else
                res.status(200).send({
                    message: 'Successfully log in',
                    result: 1,
                    content: { user },
                })
        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Error server ',
            })
        }
    }

    static authSocial = async (req, res, next) => {
        try {
            let data
            if (req.body.fbToken) {
                data = await verifyFb(req.body.fbToken)
            }
            if (req.body.ggToken) {
                data = await verifyGg(req.body.ggToken)
            }
            console.log(data)
            if (data.email === req.body.mail) {
                const user = await User.findOne({
                    where: { mail: req.body.mail },
                })

                if (!user) this.create(req, res, next, true)
                else this.findOne(req, res, next, true)
            } else {
                res.status(200).send({
                    message: 'Invalid token ',
                })
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Error server ',
            })
        }
    }

    // Delete a user with the specified userId in the request
    static delete = async (req, res) => {
        try {
            const a = await User.destroy({ where: { id: req.param('userId') } })

            if (a) res.status(200).send({ message: 'ok' })
            else res.status(200).send({ message: 'not ok' })
        } catch (e) {
            console.log('error: ', e)
        }
    }

    // static findAll = async (req, res) => {
    //   try {
    //     const users = await User.findAll();
    //     res.send(users);
    //   } catch (error) {
    //     console.log(error.message);
    //   }
    // };

    static getUserDetail = async (req, res) => {
        try {
            const user = await User.findOne({
                where: { mail: req.user.email },
                raw:true
            })
            const { password, ...rest } = user;
            res.send({...rest,isSocial: !password})
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: 'Server Error!' })
        }
    }

    static getUserInClass = async (req, res) => {
        try {
            var users = await User.getUsersInClass(req.body.courseId)
            const filter = req.body.filter
            //filter by role and exclude distinct cloumn
            if(filter)
            users = users.reduce(
                (filtered, { row, ...newUser }) =>
                    newUser.role === filter
                        ? filtered.push(newUser) && filtered
                        : filtered,
                []
            )
        

            res.send({ users: users })
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: 'Server Error!' })
        }
    }

    static mapStudentIdToAccount = async (req, res) => {
        try {
            const user = await User.findOne({
                where: { id: req.user.id },
                attributes: ['id', 'student_id'],
            })

            if (!user) {
                res.status(200).send({
                    message: 'User does not exist',
                })
                return
            }

            const studentId = req.body.studentId;
            const studentIds = await User.findOne({
                where: {
                    [Op.or]: [
                        { studentId: studentId },
                        { unMappedStudentId: studentId }
                    ]
                },
                attributes: ['id'],
            });


            if (studentIds.dataValues) {
                res.status(200).send({
                    message: 'This student id is already taken',
                })
                return;
            }

            var newObj = {
                studentId: studentId
            };
            if(!user.studentId && user.unMappedStudentId) {
                newObj = {
                    unMappedStudentId: studentId
                }
            }

            const updatedUser = await User.update(newObj, {
                where: {
                    id: req.user.id,
                },
                returning: true,
                plain: true,
            })

            res.send(updatedUser[1].dataValues)
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: 'Server Error!' })
        }
    }

    static update = async (req, res) => {
        // Validate Request
        if (!req.body) {
            res.status(200).send({
                message: 'Content can not be empty!',
            })
        }
        try {
            const user = await User.update(req.body, {
                where: {
                    id: req.user.id,
                },
                returning: true, //<<<<< To return back updated record instead of success value
                plain: true, // <<<< To return object itself, not return other messy data
            })
            if (user && user[1]) {
                const { password, ...rest } = user[1].dataValues;
                res.send(rest) //<<< to get actual object
            } else {
                res.status(404).send({
                    message: `Not found User with id ${req.user.id}.`,
                })
            }
        } catch (error) {
            res.status(500).send({
                message: 'Error updating User with id ' + req.user.id,
            })
        }
    }
}

export default UserController;
