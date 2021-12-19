import Course from "../models/course.model";
import Grade from "../models/grade.model";
import GradeItem from "../models/gradeItem.model";
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

            req.body.gradeList.forEach(async (obj) => {
                await updateOneGrade({ ...obj, courseId });
            });
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
                const { id, gradeStructureId, score,isFinal, ...other } = curr;

                if (!returnData.length || returnData[currIndex].id !== id) {
                    returnData.push({ id, [gradeStructureId]: {score,isFinal}, ...other });
                    currIndex++;
                } else {
                    returnData[currIndex][`${gradeStructureId}`] = {score,isFinal};
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
}


const updateOneGrade = async ({ studentId,studentName, courseId, ...other }) => {
    try {
        const newGrade = {
            studentId: studentId,
            studentName:studentName,
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
    } catch (error) {
        console.log(error);
        throw error.message;
    }
}

const updateGradeItem = async (gradeId, courseId, other) => {
    try {
        const course = await Course.findOne({
            where: {
                id: courseId
            },
            raw: true
        });
        const gradeStructure = JSON.parse(course.gradeStructure).gradeStructure;

        gradeStructure.forEach(async (element) => {
            const gradeStructureId = element.id;

            const newGradeItem = {
                gradeId: gradeId,
                score: other[`${gradeStructureId}`].score,
                isFinal: other[`${gradeStructureId}`].isFinal,
                gradeStructureId: gradeStructureId
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

    } catch (error) {
        console.log(error);
        throw error.message;
    }
}

const checkIfTeacherOfClass = async (userId, courseId) => {
    try {
        const userCourse = await UsersCourses.findOne({
            where: {
                courseId: courseId,
                // [Op.or]: [{ teacherId: userId }, { subTeacherId: userId }],
                teacherId: userId
            },
            raw: true
        });
        return userCourse;
    } catch (error) {
        console.log(error);
        throw error.message;
    }
}


const checkIfExistedStudentGrade = async (courseId, studentId) => {
    try {
        const grade = await Grade.findOne({
            where: {
                courseId: courseId,
                studentId: studentId
            },
            raw: true
        });

        return grade;
    } catch (error) {
        console.log(error);
        throw error.message;
    }

}

const checkIfExistedStudentGradeItem = async (gradeId, gradeStructureId) => {
    try {
        const gradeItem = await GradeItem.findOne({
            where: {
                gradeId: gradeId,
                gradeStructureId: gradeStructureId
            },
            raw: true
        });

        return gradeItem;
    } catch (error) {
        console.log(error);
        throw error.message;
    }
}

export default GradeController;