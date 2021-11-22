import Course from '../models/course.model';
import User from '../models/user.model';
import UsersCourses from '../models/usersCourses.model'
import { sendInvitationLink, validateInvitationLink, generateInvitationLink } from '../utils/emailer.util';
import { Op } from 'sequelize';

// Create and Save a new Course
class course {
  static create = async (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: 'Content can not be empty!',
      });
    }

    // Create a Course
    const course = {
      name: req.body.name,
      subject: req.body.subject,
      image: req.body.image,
      description: req.body.description,
      createdAt: Date(),
      updatedAt: Date(),
    };

    // Save Course in the database
    const newRecord = await Course.create(course);
    res.send(newRecord);
  };

  static findAllByUser = async (req, res) => {
    try {
      const userCoursesAsRoleTeacher = await UsersCourses.findAll({
        attributes: ['courseId', 'teacherId'],
        group: ['courseId', 'teacherId'],
        where: {
          [Op.or]: [
            { teacherId: req.user.id },
            { subTeacherId: req.user.id }
          ]
        },
        raw: true
      });

      const userCoursesAsRoleStudent = await UsersCourses.findAll({
        attributes: ['courseId', 'teacherId'],
        group: ['courseId', 'teacherId'],
        where: {
          studentId: req.user.id
        },
        raw: true
      });

      var coursesAsRoleTeacher =[];
      coursesAsRoleTeacher = await Course.findAll({
        where: {
          id: {
            [Op.in]: userCoursesAsRoleTeacher.map(arr => arr.courseId)
          }
        },
        raw: true
      })

      var coursesAsRoleStudent =[];
      coursesAsRoleStudent = await Course.findAll({
        where: {
          id: {
            [Op.in]: userCoursesAsRoleStudent.map(arr => arr.courseId)
          }
        },
        raw: true
      })

      const teachers = await User.findAll({
        attributes: ['id', 'name'],
        where: {
          [Op.or]: [{
            id:
            {
              [Op.in]: userCoursesAsRoleTeacher.map(arr => arr.teacherId)
            }
          },
          {
            id:
            {
              [Op.in]: userCoursesAsRoleStudent.map(arr => arr.teacherId)
            }
          }
          ]
        },
        raw: true
      })

      coursesAsRoleTeacher = coursesAsRoleTeacher.map(obj => {
        const teacherId = userCoursesAsRoleTeacher.find(course => course.courseId = obj.id).teacherId;
        const teacher = teachers.find(teacher => teacher.id === teacherId);
        return {
          ...obj,
          teacherName: teacher.name,
          isTeacher: true
        }
      })

      coursesAsRoleStudent = coursesAsRoleStudent.map(obj => {
        const teacherId = userCoursesAsRoleStudent.find(course => course.courseId = obj.id).teacherId;
        const teacher = teachers.find(teacher => teacher.id === teacherId);
        return {
          ...obj,
          teacherName: teacher.name,
          isTeacher: false
        }
      })

      const returnObject = {
        courses: coursesAsRoleStudent.concat(coursesAsRoleTeacher)
      }

      res.send(returnObject)
    } catch (error) {
      console.log(error.message);
    }
  };

  // Find a single Course with a courseId
  static findOne = async (req, res) => {
    try {
      const course = await Course.findOne({
        where: { id: req.params.courseId },
      });

      if (course) {
        res.send(course);
      } else {
        res.status(404).send({
          message: `Not found Course with id ${req.params.courseId}.`,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: 'Error retrieving Course with id ' + req.params.courseId,
      });
    }
  };

  // Update a Course identified by the courseId in the request
  static update = async (req, res) => {
    // Validate Request
    if (!req.body) {
      res.status(400).send({
        message: 'Content can not be empty!',
      });
    }
    try {
      const course = await Course.update(req.body, {
        where: {
          id: req.body.id,
        },
        returning: true, //<<<<< To return back updated record instead of success value
        plain: true, // <<<< To return object itself, not return other messy data
      });
      if (course) {
        res.send(course[1].dataValues); //<<< to get actual object
      } else {
        res.status(404).send({
          message: `Not found Course with id ${req.body.id}.`,
        });
      }
    } catch (error) {
      res.status(500).send({
        message: 'Error updating Course with id ' + req.body.id,
      });
    }
  };

  // Delete a Course with the specified courseId in the request
  static delete = async (req, res) => {
    try {
      const successValue = await Course.destroy({
        where: {
          id: req.params.courseId,
        },
      });

      if (successValue) {
        const deletedCourse = await Course.findOne({
          where: {
            id: req.params.courseId,
          },
          paranoid: false, // <<< It will retrieve soft-deleted record
        });
        res.status(200).send(deletedCourse);
      } else {
        res.status(404).send({
          message: `Not found Course with id ${req.params.courseId}.`,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: 'Could not delete Course with id ' + req.params.courseId,
      });
    }
  };

  static restore = async (req, res) => {
    try {
      const course = await Course.findOne({
        where: { id: req.params.courseId },
        paranoid: false
      });
      if (!course) {
        res.status(400).send({ messsage: 'Course does not exist' });
        return;
      }
      course.restore();
      res.status(200).send({ messsage: 'Course has been restored' });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: 'Server error',
      });
    }
  };

  static sendInvitationLink = async (req, res) => {
    try {
      const { email, courseId } = req.body;

      const user = await User.findOne({
        where: {
          mail: email
        },
        raw: true
      });
      if (!user) {
        res.status(400).send({ messsage: 'User does not exist' });
        return;
      }
      const course = await Course.findByPk(courseId);
      console.log(course);
      if (!course) {
        res.status(400).send({ messsage: 'Class does not exist' });
        return;
      }

      const usersCourse = await UsersCourses.findOne({
        where: {
          courseId: courseId,
          studentId: user.id
        }
      });

      if (usersCourse) {
        res.status(400).send({ messsage: 'User already joined this class' });
        return;
      }

      sendInvitationLink(req, res)
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: 'Server error'
      });
    }
  }

  static validateJoinningRequestByEmail = async (req, res) => {
    try {
      const verifiedJwt = validateInvitationLink(req.query);

      if (verifiedJwt) {
        const user = await User.findOne({
          where: {
            mail: verifiedJwt.email
          },
          raw: true
        });

        if (!user) {
          res.status(400).send({ messsage: 'User doesn not exist' });
          return;
        }

        const usersCourse = await UsersCourses.findOne({
          where: {
            courseId: verifiedJwt.courseId,
            [Op.or]: [
              { studentId: user.id },
              { subTeacherId: user.id },
            ]
          }
        });

        if (usersCourse) {
          res.status(400).send({ messsage: 'User already joined this class' });
          return;
        }
        var newUsersCourses = {
          courseId: verifiedJwt.courseId,
          teacherId: verifiedJwt.teacherId
        }
        if (verifiedJwt.role === 'teacher') {
          newUsersCourses = {
            ...newUsersCourses,
            subTeacherId: user.id
          }
        } else {
          newUsersCourses = {
            ...newUsersCourses,
            studentId: user.id
          }
        }

        const userCourses = await UsersCourses.create(newUsersCourses);

        res.redirect('https://classroom-manager.netlify.app/course/'+userCourses.courseId);
        res.send(userCourses);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: 'Server error'
      });
    }
  }

  static validateJoinningRequestByLink = async (req, res) => {
    try {
      const verifiedJwt = validateInvitationLink(req.query);

      if (verifiedJwt) {
        const user = await User.findOne({
          where: {
            mail: req.user.email
          },
          raw: true
        });

        if (!user) {
          res.status(400).send({ messsage: 'User doesn not exist' });
          return;
        }
        const usersCourse = await UsersCourses.findOne({
          where: {
            courseId: verifiedJwt.courseId,
            studentId: user.id
          }
        });

        if (usersCourse) {
          res.status(400).send({ messsage: 'User already joined this class' });
          return;
        }

        const newUsersCourses = {
          courseId: verifiedJwt.courseId,
          teacherId: verifiedJwt.teacherId,
          studentId: user.id
        }

        const userCourses = await UsersCourses.create(newUsersCourses);

        res.send(userCourses);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: 'Server error'
      });
    }
  }

  static createInvitationLink = async (req, res) => {
    try {
      const invitationLink = await generateInvitationLink(req.body);
      res.send({ invitationLink });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: 'Server error'
      });
    }
  }
}

export default course;
