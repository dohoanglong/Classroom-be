import GradeItem from "../models/gradeItem.model";
import GradeReview from "../models/gradeReview.model";
import GradeReviewReply from "../models/gradeReviewReply.model";
import UsersCourses from "../models/usersCourses.model";
import NotificationController from './notificationController'

class GradereviewController {
    static add = async (req, res, next) => {
        try {
            const { gradeItemId, studentId, courseId } = req.body;
            const gradeReview = await GradeReview.findOne({
                where: {
                    gradeItemId, studentId, courseId,
                    status: "pending"
                },
                raw: true
            });

            if (gradeReview) {
                res.status(200).send({ message: "already had" });
                return;
            }

            await GradeReview.create({ ...req.body, status: "pending", userId: req.user.id });

            // Create Notification
            const userCourse = await UsersCourses.findOne({ studentId: req.user.id });
            req.type = 4;
            req.userIdReceive = userCourse.teacherId
            await NotificationController.add(req, res, next)
            res.status(200).send({ message: "success" });
        } catch (error) {
            console.log(error);
            res.status(500).send("Something wrong");
        }
    }

    static remove = async (req, res) => {
        try {
            await GradeReview.delete({ where: { id: req.params.gradeReviewId } });
            res.status(200).send({ message: "success" });
        } catch (error) {
            console.log(error);
            res.status(500).send("Something wrong");
        }
    }

    static get = async (req, res) => {
        try {
            const gradeReview = await GradeReview.getDetailById(req.params.gradeReviewId);
            const comments = await GradeReviewReply.getAll(gradeReview[0].id);

            res.status(200).send({ gradeReview, comments });
        } catch (error) {
            console.log(error);
            res.status(500).send("Something wrong");
        }
    }

    static getGradeReviewForStudent = async (req, res) => {
        try {
            const userId = req.user.id;
            const { courseId, gradeItemId } = req.body;
            const gradeReview = await GradeReview.findOne(
                {
                    where: {
                        courseId,
                        studentId: userId,
                        gradeItemId
                    },
                    raw: true
                }
            );
            const comments = await GradeReviewReply.getAll(gradeReview.id);

            res.status(200).send({ gradeReview, comments });
        } catch (error) {
            console.log(error);
            res.status(500).send("Something wrong");
        }
    }

    static updateScoreAndStatus = async (req, res, next) => {
        try {
            const isTeacher = await checkIfTeacherOfClass(req.user.id, req.body.courseId);
            if (!isTeacher) {
                res.status(200).send({ message: "only teacher can view all grade review of class" });
                return;
            }
            const { status, gradeReviewId, newScore } = req.body;
            const gradeReview = await GradeReview.update({ status: status },
                {
                    where: { id: gradeReviewId }, returning: true, raw: true,
                    plain: true
                });

            // Notification
            req.body.gradeItemId = gradeReview[1].gradeItemId;
            req.type = 3;
            req.userIdReceive = gradeReview[1].userId;
            await NotificationController.add(req, res, next)

            if (newScore) {
                await GradeItem.update({ score: newScore },
                    { where: { id: gradeReview[1].gradeItemId } });
            }
            res.status(200).send({ message: "success" });
        } catch (error) {
            console.log(error);
            res.status(500).send("Something wrong");
        }
    }

    static getAll = async (req, res) => {
        try {
            const isTeacher = await checkIfTeacherOfClass(req.user.id, req.params.courseId);
            if (!isTeacher) {
                res.status(200).send({ message: "only teacher can view all grade review of class" });
                return;
            }

            const gradeReviews = await GradeReview.getAll(req.params.courseId);

            res.status(200).send(gradeReviews);
        } catch (error) {
            console.log(error);
            res.status(500).send("Something wrong");
        }
    }

    static addComment = async (req, res, next) => {
        try {
            const gradeReview = await GradeReview.findOne({
                where: { id: req.body.gradeReviewId }
            });
            if (!gradeReview) {
                res.status(200).send({ message: "does not exist grade review" });
                return;
            }
            const userId = req.user.id;
            // Create Notification
            req.body.gradeItemId = gradeReview.gradeItemId;
            const userCourse = await UsersCourses.findOne({ studentId: req.user.id });
            const isTeacher = await checkIfTeacherOfClass(req.user.id, req.body.courseId);
            if (!isTeacher) {
                req.type = 5;

            } else {
                req.type = 2;
            }
            req.userIdReceive = !isTeacher ? userCourse.teacherId : gradeReview.userId;
            await NotificationController.add(req, res, next)
            await GradeReviewReply.create({ ...req.body, userId });
            res.status(200).send({ message: "success" });
        } catch (error) {
            console.log(error);
            res.status(500).send("Something wrong");
        }
    }

    static getAllOf = async (req, res) => {
        try {


            const gradeReviews = await GradeReview.findAll({
                where: { courseId: req.params.courseId, userId: req.user.id }
            });

            res.status(200).send(gradeReviews);
        } catch (error) {
            console.log(error);
            res.status(500).send("Something wrong");
        }
    }
}

const checkIfTeacherOfClass = async (userId, courseId) => {
    const userCourse = await UsersCourses.findOne({
        where: {
            courseId: courseId,
            // [Op.or]: [{ teacherId: userId }, { subTeacherId: userId }],
            teacherId: userId
        },
        raw: true
    });

    return userCourse;


}

export default GradereviewController;