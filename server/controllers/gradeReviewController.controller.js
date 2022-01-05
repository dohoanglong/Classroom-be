import GradeReview from "../models/gradeReview.model";
import GradeReviewReply from "../models/gradeReviewReply.model";

class GradereviewController {
    static add = async (req, res) => {
        try {
            await GradeReview.create(req.body);
            res.send(200).send({message: "success"});
        } catch (error) {
            console.log(error);
            res.status(500).send("Something wrong");
        }
    }

    static remove = async (req, res) => {
        try {
            await GradeReview.delete({where: {id: req.params.gradeReviewId}});
            res.send(200).send({message: "success"});
        } catch (error) {
            console.log(error);
            res.status(500).send("Something wrong");
        }
    }

    static get = async (req, res) => {
        try {
            await GradeReview.getOne(req.params.gradeReviewId);
            res.send(200).send({message: "success"});
        } catch (error) {
            console.log(error);
            res.status(500).send("Something wrong");
        }
    }

    static getAll = async (req, res) => {
        try {
            const gradeReviews = await GradeReview.getAll(req.params.courseId);
            res.send(200).send(gradeReviews);
        } catch (error) {
            console.log(error);
            res.status(500).send("Something wrong");
        }
    }

    static addComment = async (req, res) => {
        try {
            const userId = req.user.id;
            await GradeReviewReply.create({...req.body,userId});
            res.send(200).send({message: "success"});
        } catch (error) {
            console.log(error);
            res.status(500).send("Something wrong");
        }
    }
}


export default GradereviewController;