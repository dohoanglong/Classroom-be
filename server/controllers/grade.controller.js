import Course from "../models/course.model";
import Grade from "../models/grade.model";
import GradeItem from "../models/gradeItem.model";
import User from "../models/user.model";
import UsersCourses from "../models/usersCourses.model";


class GradeController {

    static updateClassGrade = async (req, res) => {
        try {
            const courseId = req.body.courseId;
            const isTeacher = await checkIfTeacherOfClass(req.user.id, req.body.courseId);
            if (!isTeacher) {
                res.status(200).send({ message: "only teacher can update grade" });
                return;
            }

            for (const obj of req.body.gradeList) {
                await updateOneGrade({ ...obj, courseId });
            }

            res.status(200).send({ message: "update successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: 'Server Error'
            })
        }
    }

    static updateStudentGrade = async (req, res) => {
        try {
            const isTeacher = await checkIfTeacherOfClass(req.user.id, req.body.courseId);
            if (!isTeacher) {
                res.status(200).send({ message: "only teacher can update grade" });
                return;
            }
            const newGrade = await updateOneGrade(req.body);

            res.status(200).send(newGrade);
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: 'Server Error'
            })
        }
    }

    static getClassGrade = async (req, res) => {
        try {
            const courseId = req.params.courseId;
            const isTeacher = await checkIfTeacherOfClass(req.user.id, courseId);
            if (!isTeacher) {
                res.status(200).send({ message: "only teacher can view class's grade" });
                return;
            }

            const data = await Grade.getClassGrade(courseId);

            var currIndex = -1;
            var returnData = [];
            data.forEach((curr) => {
                var { id, gradeStructureId, score, isFinal, ...other } = curr;
                if (score < 0) score = "";

                if (!returnData.length || returnData[currIndex].id !== id) {
                    returnData.push({ id, [gradeStructureId]: { score, isFinal }, ...other });
                    currIndex++;
                } else {
                    returnData[currIndex][`${gradeStructureId}`] = { score, isFinal };
                }
            });

            res.status(200).send(returnData);
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: 'Server Error'
            })
        }
    }

    static viewGrade = async (req, res) => {
        const userId = req.user.id;

        //check whether the user is in this course or not
        const usersCourse = await UsersCourses.findOne({
            where:
            {
                studentId: userId,
                courseId: req.body.courseId
            },
            raw: true
        })


        if (!usersCourse) {
            res.status(200).send({ message: "You are not a student of this class" });
            return;
        }
        //check whether the user is mapped with student id (MSVV) or not
        const user = await User.findOne({
            where: {
                id: userId
            },
            raw: true
        })

        if (!user.studentId) {
            res.status(200).send({ message: "You have not mapped your account with your student id yet" });
            return;
        }

        //join between grade and grade_item to get grade of the user
        const data = await Grade.getStudentGrade(user.studentId, req.body.courseId);

        var currIndex = -1;
        var returnData = [];
        data.forEach((curr) => {
            const { student_id, gradeStructureId, grade_item_id, title, score, ...other } = curr;

            if (!returnData.length || returnData[currIndex].student_id !== student_id) {
                returnData.push({ student_id, [gradeStructureId]: { grade_item_id, title, score }, ...other });
                currIndex++;
            } else {
                returnData[currIndex][`${gradeStructureId}`] = { grade_item_id, title, score };
            }
        });

        res.status(200).send(returnData);
    }
}


const updateOneGrade = async ({ studentId, studentName, courseId, ...other }) => {
    const newGrade = {
        studentId: studentId,
        studentName: studentName,
        courseId: courseId
    }
    const isExited = await checkIfExistedStudentGrade(courseId, studentId);

    var gradeId;
    if (isExited) {
        const grade = await Grade.update(newGrade, {
            where: {
                studentId: studentId,
                courseId: courseId,
            },
            returning: true,
            plain: true,
        });
        gradeId = grade[1].dataValues.id;
    }
    else {
        const grade = await Grade.create(newGrade, { plain: true });
        gradeId = grade.dataValues.id;
    }

    await updateGradeItem(gradeId, courseId, other);

    return newGrade;
}

const updateGradeItem = async (gradeId, courseId, other) => {
    const course = await Course.findOne({
        where: {
            id: courseId
        },
        raw: true
    });
    const gradeStructure = JSON.parse(JSON.parse(course.gradeStructure).gradeStructure);

    gradeStructure.forEach(async (element) => {
        const gradeStructureId = element.id;
        const gradeStructureTitle = element.title;

        const newGradeItem = {
            gradeId: gradeId,
            score: other[`${gradeStructureId}`].score ? other[`${gradeStructureId}`].score : -1,
            isFinal: other[`${gradeStructureId}`].isFinal,
            gradeStructureId: gradeStructureId,
            title: gradeStructureTitle
        };

        const isExited = await checkIfExistedStudentGradeItem(gradeId, gradeStructureId);

        if (isExited) {
            await GradeItem.update(newGradeItem, {
                where: {
                    gradeId: gradeId,
                    gradeStructureId: gradeStructureId,
                },
                returning: true,
                plain: true,
            });
        }
        else {
            await GradeItem.create(newGradeItem, { raw: true });
        }

    })
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


const checkIfExistedStudentGrade = async (courseId, studentId) => {

    const isExisted = await Grade.findOne({
        where: {
            courseId: courseId,
            studentId: studentId
        },
        raw: true
    });

    return isExisted;


}

const checkIfExistedStudentGradeItem = async (gradeId, gradeStructureId) => {
    const gradeItem = await GradeItem.findOne({
        where: {
            gradeId: gradeId,
            gradeStructureId: gradeStructureId
        },
        raw: true
    });

    return gradeItem;
}

export default GradeController;