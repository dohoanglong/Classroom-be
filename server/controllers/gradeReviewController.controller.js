import GradeItem from "../models/gradeItem.model";
import GradeReview from "../models/gradeReview.model";
import GradeReviewReply from "../models/gradeReviewReply.model";
import UsersCourses from "../models/usersCourses.model";

class GradereviewController {
    static add = async (req, res) => {
        try {
            await GradeReview.create({ ...req.body, status: "pending" });
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
            const gradeReview = await GradeReview.findByPk(req.params.gradeReviewId);
            const comments = await GradeReviewReply.findAll(
                { where: { gradeReviewId: gradeReview.id }, raw: true });

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
            const comments = await GradeReviewReply.findAll(
                { where: { gradeReviewId: gradeReview.id }, raw: true });

            res.status(200).send({ gradeReview, comments });
        } catch (error) {
            console.log(error);
            res.status(500).send("Something wrong");
        }
    }

    static updateScoreAndStatus = async (req, res) => {
        try {
            const isTeacher = await checkIfTeacherOfClass(req.user.id, req.body.courseId);
            if (!isTeacher) {
                res.status(200).send({ message: "only teacher can view all grade review of class" });
                return;
            }
            const { status, gradeReviewId, gradeItemId, newScore } = req.body;
            await GradeReview.update({ status: status },
                { where: { id: gradeReviewId } });
            await GradeItem.update({ score: newScore },
                { where: { id: gradeItemId } });
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

            const gradeReviews = await GradeReview.findAll({
                where: { courseId: req.params.courseId }
            });
            res.status(200).send(gradeReviews);
        } catch (error) {
            console.log(error);
            res.status(500).send("Something wrong");
        }
    }

    static addComment = async (req, res) => {
        try {
            const gradeReview = await GradeReview.findOne({
                where: { id: req.body.gradeReviewId }
            });
            if (!gradeReview) {
                res.status(200).send({ message: "does not exist grade review" });
                return;
            }
            const userId = req.user.id;
            await GradeReviewReply.create({ ...req.body, userId });
            res.status(200).send({ message: "success" });
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