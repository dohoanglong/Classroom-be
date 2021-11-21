import User from '../models/user.model';
import { verifyFb, verifyGg } from '../helpers/auth';
import { Op } from 'sequelize';
import Course from '../models/course.model';
import UsersCourses from '../models/usersCourses.model';

class user {
  static create = async (req, res, next, isFromSocial = false) => {
    try {
      if (!req.body) {
        res.status(400).send({
          message: 'Content can not be empty!',
        });
      }
      //   check if exist mail
      const user = await User.findOne({ where: { mail: req.body.mail } });

      if (user) {
        res
          .status(400)
          .send({ message: 'Existed mail', result: 0, content: null });
      }
      // Create a User
      let encrytedPassword = null;
      if (!isFromSocial) {
        encrytedPassword = await User.generateHash(req.body.password);
      }
      // Validate request
      const newUser = {
        name: req.body.name,
        password: encrytedPassword,
        mail: req.body.mail,
        createdAt: Date(),
        updatedAt: Date(),
      };

      // Save User in the database
      const newRecord = await User.create(newUser);
      res.send({
        message: 'Successfully created account',
        result: 1,
        content: { user: newRecord },
      });
    } catch (e) {
      console.log('er: ', e);
      res.status(500).send({
        message: 'Error server ',
      });
    }
  };

  // Find a single user
  static findOne = async (req, res, next, isFromSocial = false) => {
    try {
      const user = await User.findOne({ where: { mail: req.body.mail } });
      if (!isFromSocial) {
        if (!user)
          res.status(400).send({
            message: 'Non existed mail',
            result: 0,
            content: null,
          });
        if (user.password !== req.body.password) {
          res.status(400).send({
            message: 'Wrong password',
            result: 0,
            content: null,
          });
        } else
          res.status(200).send({
            message: 'Successfully log in',
            result: 1,
            content: { user },
          });
      } else
        res.status(200).send({
          message: 'Successfully log in',
          result: 1,
          content: { user },
        });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: 'Error server ',
      });
    }
  };

  static authSocial = async (req, res, next) => {
    try {
      let data;
      if (req.body.fbToken) {
        data = await verifyFb(req.body.fbToken);
      }
      if (req.body.ggToken) {
        data = await verifyGg(req.body.ggToken);
      }
      console.log(data);
      if (data.email === req.body.mail) {
        const user = await User.findOne({ where: { mail: req.body.mail } });

        if (!user) this.create(req, res, next, true);
        else this.findOne(req, res, next, true);
      } else {
        res.status(400).send({
          message: 'Invalid token ',
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: 'Error server ',
      });
    }
  };

  // Delete a user with the specified userId in the request
  static delete = async (req, res) => {
    try {
      const a = await User.destroy({ where: { id: req.param('userId') } });

      if (a) res.status(200).send({ message: 'ok' });
      else res.status(200).send({ message: 'not ok' });
    } catch (e) {
      console.log('error: ', e);
    }
  };

  // static findAll = async (req, res) => {
  //   try {
  //     const users = await User.findAll();
  //     res.send(users);
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };


  static getUserDetail = async (req, res, next) => {
    try {
      const user = await User.findOne({
        where: { mail: req.user.email },
        attributes: { exclude: ['password'] }
      });
      res.send(user);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Server Error!' });
    }
  }

  static getUserInClass = async (req, res) => {
    try {
      var queries = {
        courseId: req.body.courseId
      };

      if (req.body.filter === 'student') {
        queries = {
          ...queries,
          studentId: {
            [Op.not]: null
          }
        };
      }

      if (req.body.filter === 'teacher') {
        queries = {
          ...queries,
          studentId: {
            [Op.is]: null
          }
        };
      }

      const usersCourses = await UsersCourses.findAll({
        attributes: ['courseId', 'teacherId', 'subTeacherId', 'studentId'],
        where: queries,
        raw: true
      })

      var teachers = [];
      var students = [];

      if (req.body.filter === 'student' || !req.body.filter) {
        students = await User.findAll({
          attributes: ['id', 'name', 'mail'],
          where: {
            id: usersCourses.map(obj => obj.studentId).filter(obj => obj != null)
          },
          raw: true
        })
        students = students.map(student => {
          return {
            ...student,
            isTeacher: false
          }
        });
      }
      const teacherIds = usersCourses.map(obj => obj.subTeacherId)
        .concat([usersCourses[0].teacherId]);//add main teacher
      if (req.body.filter === 'teacher' || !req.body.filter) {
        teachers = await User.findAll({
          attributes: ['id', 'name', 'mail'],
          where: {
            id: teacherIds.filter(obj => obj != null)
          },
          raw: true
        })
        teachers = teachers.map(teacher => {
          return {
            ...teacher,
            isTeacher: true
          }
        });
      }

      res.send({ users: teachers.concat(students) });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Server Error!' });
    }
  }

  static mapStudentIdToAccount = async (req, res, next) => {
    try {
      const user = await User.findOne({
        where: { id: req.user.id },
        attributes: ['id', 'student_id']
      });

      if (!user) {
        res.status(400).send({
          message: 'User does not exist',
        });
        return;
      }

      console.log(user);
      if (user.dataValues.student_id) {
        res.status(400).send({
          message: 'Student Id is already taken',
        });
        return;
      }
      const updatedUser = await User.update(req.body, {
        where: {
          id: req.user.id
        },
        returning: true,
        plain: true,
      });
      res.send(updatedUser[1].dataValues);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Server Error!' });
    }
  }
}

export default user;
