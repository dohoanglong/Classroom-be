import passport from 'passport'
import passpotLocal from 'passport-local'
import passportJwt from 'passport-jwt'
import AdminAccount from '../models/adminAccount.model'

const JWTstrategy = passportJwt.Strategy
const ExtractJWT = passportJwt.ExtractJwt
const localStrategy = passpotLocal.Strategy

passport.use(
    'createAdminAccount',
    new localStrategy(
        {
            usernameField: 'userName',
            passwordField: 'password',
            passReqToCallback: true,
        },
        async (req, userName, password, done) => {
            try {
                var adminAccount = await AdminAccount.findOne({ where: { userName } })
                if (adminAccount) {
                    return done(null, false, {
                        message:
                            'User name already existed, please choose another name',
                    })
                }

                const encrytedPassword = await AdminAccount.generateHash(password)

                const {name,age,mail,phoneNumber} = req.body;

                adminAccount = {
                    userName: userName,
                    password: encrytedPassword,
                    name,
                    age,
                    mail,
                    phoneNumber
                }

                // Save admin into the database
                const newAdmin = await AdminAccount.create(adminAccount)

                return done(null, newAdmin)
            } catch (error) {
                console.log(error)
                done(error)
            }
        }
    )
)

passport.use(
    'loginIntoAdminAccount',
    new localStrategy(
        {
            usernameField: 'userName',
            passwordField: 'password',
            passReqToCallback: true,
        },
        async (req, userName, password, done) => {
            try {
                const adminAccount = await AdminAccount.findOne({ where: { userName } })

                if (!adminAccount) {
                    return done(null, false, { message: 'User not found' })
                }
                const isValidate = await AdminAccount.isValidPassword(
                    password,
                    adminAccount.password
                )
                if (!isValidate) {
                    return done(null, false, { message: 'Wrong Password' })
                }

                return done(null, adminAccount, { message: 'Logged in Successfully' })
            } catch (error) {
                return done(error)
            }
        }
    )
)

passport.use(
    new JWTstrategy(
        {
            secretOrKey: process.env.JWT_SECRET_KEY,
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        },
        async (token, done) => {
            try {
                return done(null, token.user)
            } catch (error) {
                done(error)
            }
        }
    )
)

export default passport
