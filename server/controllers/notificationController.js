import User from "../models/user.model";
import Notification from "../models/notification.model";
import Course from "../models/course.model";
import GradeItem from "../models/gradeItem.model";
import UserCourses from "../models/usersCourses.model";

const mapMessageType = {
    1: 'finalized your grade composition at',
    2: 'replied to your grade review at',
    3: 'created final decision on your mark review at',
    4: 'requested a grade review at',
    5: 'replied to your repliment a grade review at',
}

const convertToMessage = (type, nameSender, nameComposition , nameCourse) => `${nameSender} ${mapMessageType[type]} ${nameComposition} of ${nameCourse}`

class NotificationController {
    static add = async (req, res,next) => {
        try {
            const gradeItem = await GradeItem.findOne({where:{id: req.body.gradeItemId},raw: true});
            const course = await Course.findOne({id: gradeItem.courseId });
           const userSend = await User.findOne({where:{id: req.user.id}, raw:true});
            const type = req.type
            const message = convertToMessage(req.type, userSend.name,gradeItem.title,course.name)
            const userId = req.userIdReceive ;
            await Notification.create({ type,userId, message,courseId: course.id, readed: false });
            next();
            // res.status(200).send({ message: "success",notification });
        } catch (error) {
            console.log(error);
            res.status(500).send("Something wrong");
        }
    }
}



export default NotificationController;