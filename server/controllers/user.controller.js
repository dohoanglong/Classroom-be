import User from '../models/user.model';

class user {
  static create = async (req, res) => {
    try {
      // Validate request
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
      const newUser = {
        name: req.body.name,
        password: req.body.password,
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
  static findOne = async (req, res) => {
    try {
      const user = await User.findOne({ where: { mail: req.body.mail } });
      if (!user)
        res.status(400).send({
          message: 'Non existed mail',
          result: 0,
          content: null,
        });
      if (user.password !== req.body.password)
        res.status(400).send({
          message: 'Wrong password',
          result: 0,
          content: null,
        });
      res
        .status(200)
        .send({ message: 'Successfully log in', result: 1, content: { user } });
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

  static findAll = async (req, res) => {
    try {
      const users = await User.findAll();
      res.send(users);
    } catch (error) {
      console.log(error.message);
    }
  };
}

export default user;
