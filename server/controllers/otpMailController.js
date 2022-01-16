import User from "../models/user.model";
import Notification from "../models/notification.model";
import Course from "../models/course.model";
import GradeItem from "../models/gradeItem.model";
import OtpMail from "../models/otpMail.model";
import { Op } from 'sequelize'
import { sendMail } from '../utils/emailer.util'



const generateOtp = () => Math.floor(100000 + Math.random() * 900000)

class OtpMailController {
    static add = async (req, res,next) => {
        try {
            const {mail} = req.body
            const randomOtp = generateOtp();
            var user = await User.findOne({ where: { mail: mail }, paranoid: false,raw:true  })
            console.log('------------------------------',user)
            if (user) {
                res.status(200).send({message:
                    'Email already existed, please choose another email'})
                
            } else if(user?.deletedAt) {
                res.status(200).send({message: 'This email is banned'})
            } else {
                const subject = 'Verify account from Classroom Managers';
                const content= `<p> Your OTP is ${randomOtp} </p>`
                await sendMail(mail,subject,content )
                const otp = await OtpMail.update({otp: randomOtp},{where:{mail: mail}});
                if(!otp[0]) {
                    await OtpMail.create({mail, otp: randomOtp})
                } 
                res.status(200).send({message: 'Sent OTP to your mail', result: 1})
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Something wrong");
        }
    }

    static registerOtp = async (req,res) => {
        try {

            const {mail, otp, name,password} = req.body;
            
            const user = await User.findOne({where:{mail: mail}, raw: true});
            if(user){
                res.status(200).send({message: 'Existed mail registered'}); return;
            }

            const otpMail =await OtpMail.findOne({where:{mail: mail},raw:true});
            console.log(otpMail, otp, '`````````````````````````````')
            if( otp !== otpMail.otp) {
                res.status(200).send({message: 'wrong OTP'});
                return ;
            }
            const encrytedPassword = await User.generateHash(password)
            const objUser = {
                name,
                password: encrytedPassword,
                mail: mail,
                createdAt: Date(),
                updatedAt: Date(),
            }

            // Save User into the database
            const newUser = await User.create(objUser)
            res.status(200).send({message: 'Register successfully', result: 1})
        } catch(e) {
            console.log(e);
            res.status(500).send('Sth went wrong')
        }
    }
}



export default OtpMailController;