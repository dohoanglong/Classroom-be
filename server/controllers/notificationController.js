import User from '../models/user.model'
import Notification from '../models/notification.model'
import Course from '../models/course.model'
import GradeItem from '../models/gradeItem.model'
import UserCourses from '../models/usersCourses.model'
import { Op } from 'sequelize'

const mapMessageType = {
    1: 'finalized your grade composition at',
    2: 'replied to your grade review at',
    3: 'created final decision on your mark review at',
    4: 'requested a grade review at',
    5: 'replied to your repliment a grade review at',
}

const convertToMessage = (type, nameSender, nameComposition, nameCourse) =>
    `${nameSender} ${mapMessageType[type]} ${nameComposition} of ${nameCourse}`

class NotificationController {
    static add = async (req, res, next) => {
        try {
            const gradeItem = await GradeItem.getInfor(req.body.gradeItemId)
            if (gradeItem?.length) {
                const { title, name, courseid } = gradeItem[0]
                const userSend = await User.findOne({
                    where: { id: req.user.id },
                    raw: true,
                })
                const type = req.type
                const message = convertToMessage(
                    req.type,
                    userSend.name,
                    title,
                    name
                )
                const userId = req.userIdReceive
                await Notification.create({
                    type,
                    userId,
                    message,
                    courseId: courseid,
                    readed: false,
                })
                next()
            } else next()
            // res.status(200).send({ message: "success",notification });
        } catch (error) {
            console.log(error)
            res.status(500).send('Something wrong')
        }
    }

    static getAllNotification = async (req, res) => {
        try {
            const notifications = await Notification.findAll({
                where: { userId: req.user.id },
                order: [['created_at', 'DESC']],
            })
            res.status(200).send({ result: 1, notifications })
        } catch (e) {
            res.status(500).send('Something wrong')
        }
    }

    static markReadedAll = async (req, res) => {
        try {
            const notifications = await Notification.update(
                { readed: true },
                { where: { userId: req.user.id } }
            )
            res.status(200).send({ result: 1, notifications })
        } catch (e) {
            res.status(500).send('Something wrong')
        }
    }

    static createFinalizedNotifications = async (req, res) => {
        try {
            const { title, courseId } = req.body
            const course = await Course.findOne({
                where: { id: courseId },
                raw: true,
            })
            const userSend = await User.findOne({
                where: { id: req.user.id },
                raw: true,
            })
            const message = convertToMessage(
                1,
                userSend.name,
                title,
                course.name
            )
            const students = await UserCourses.findAll({
                where: {
                    courseId,
                    studentId: {
                        [Op.not]: null,
                    },
                },
                raw: true,
            })
            await Notification.bulkCreate(
                students.map((student) => ({
                    type: 1,
                    userId: student.studentId,
                    message,
                    courseId,
                    readed: false,
                }))
            )

            res.status(200).send({ message: 'success' })
        } catch (error) {
            console.log(error)
            res.status(500).send('Something wrong')
        }
    }
}

export default NotificationController
