import passport from 'passport'
import passpotLocal from 'passport-local'
import passportJwt from 'passport-jwt'
import User from '../models/user.model';

const JWTstrategy = passportJwt.Strategy;
const ExtractJWT = passportJwt.ExtractJwt;
const localStrategy = passpotLocal.Strategy;

passport.use(
  'register',
  new localStrategy(
    {
      usernameField: 'mail',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, mail, password, done) => {
      try {
        var user = await User.findOne({where:{ 'mail': mail }});
        if (user) {
          return done(null, false, {
            message: 'Email already existed, please choose another email'
          })
        }

        const encrytedPassword = await User.generateHash(password);

        user = {
          name: req.body.name,
          password: encrytedPassword,
          mail: mail,
          createdAt: Date(),
          updatedAt: Date(),
        };

        // Save User in the database
        const newUser = await User.create(user);

        return done(null, newUser);
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);

passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'mail',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req,mail, password, done) => {
      try {
        
        const user = await User.findOne({where:{ mail }});

        if (!user) {
          return done(null, false, { message: 'User not found' });
        }
        const isValidate = await User.isValidPassword(password,user.password);
        if (!isValidate) {
          return done(null, false, { message: 'Wrong Password' });
        }

        return done(null, user, { message: 'Logged in Successfully' });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: 'TOP_SECRET',
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

export default passport;


