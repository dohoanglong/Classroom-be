import nodeMailer from 'nodemailer'
import jwt from 'jsonwebtoken'
// import prettylink from 'prettylink'
import dotenv from 'dotenv'
import {google} from 'googleapis'
dotenv.config()

const CLIENT_ID='639925172544-p0pdg0um5v2l0ov9rnvnuc48nnaqhcrs.apps.googleusercontent.com'
const CLIENT_SECRET='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'
const REDIRECT_URI='https://developers.google.com/oauthplayground'
const REFRESH_TOKEN='1//04KIXfdlIJzrCCgYIARAAGAQSNwF-L9IrkybEZQHiI2YZ1QMJXZryOBQF8fxz7z67g1U-cq94MyEQye0X1_UHcNelNZqrc4uSHeY'

const adminEmail = 'emailsenderfromhcmus@gmail.com'
const adminPassword = 'adminAdm1n'
const mailHost = 'smtp.gmail.com'
const mailPort = 465
// const url = process.env.NODE_ENV === 'development'
//     ? process.env.REACT_APP_CLIENT_LOCAL : process.env.REACT_APP_CLIENT_PRODUCTION

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

const createTransporter =  async () => {
    const accessToken = await oAuth2Client.getAccessToken();
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: adminEmail,
            clientId: CLIENT_ID,
            clientSecret : CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken      
        },
        // host: mailHost,
        // port: mailPort,
        // secure: true,
    })
    return transporter;
}


export const sendMail = async (email,subject,content) => {
    const options = {
        from: `"Hacker 🐧 " <${adminEmail}>`,
        to: email,
        subject: subject,
        html: content,
    }
    const transporter = await createTransporter();
    return transporter.sendMail(options)
}

const emailTemplate = (username, link) => `
    <p><b>From ${username}</b></p>
    <p>Click the link to join class: ${link}</p>
`
const generate = (email, courseId, teacherId, role) => {
    const date = new Date()
    date.setHours(date.getHours() + 1)
    return jwt.sign(
        { email, courseId, teacherId, role, expiration: date },
        process.env.JWT_SECRET_KEY_JOINCLASS
    )
}

export const generateInvitationLinkSendViaEmail = async ({
    email,
    courseId,
    teacherId,
    role,
}, url) => {
    const token = generate(email, courseId, teacherId, role)

    var link = `${url}/courses/joinClass?token=${token}`

    // const bitly = new prettylink.Bitly(process.env.BITLY_SECRET_KEY)
    // try {
    //     link = await bitly.short(link)
    // } catch (error) {
    //     link = error.link //<<<even I dont know why xD
    // }

    return link
}

export const generateInvitationLink = async ({ courseId, teacherId }, url) => {
    const token = generate(null, courseId, teacherId)
    var link = `${url}/courses/joinClassByLink?token=${token}`
    // const bitly = new prettylink.Bitly(process.env.BITLY_SECRET_KEY)
    // try {
    //     link = await bitly.short(link)
    // } catch (error) {
    //     link = error.link //<<<even I dont know why xD
    // }
    return link
}

export const sendInvitationLink = async (req, res) => {
    const { email, name } = req.body

    const url = req.get('origin');
    const invitationLink = await generateInvitationLinkSendViaEmail(req.body, url);
    const options = {
        from: `"Hacker 🐧 " <${adminEmail}>`,
        to: email,
        subject: 'Invitation',
        html: emailTemplate(name, invitationLink),
    }
    const transporter = await createTransporter();
    return transporter.sendMail(options, (error) => {
        if (error) {
            console.log(error)
            return res.status(500).send({ message: 'cannot send email' })
        }
        return res.status(200).send({ message: 'email has been sent' })
    })
}

export const validateInvitationLink = ({ token }) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY_JOINCLASS)
        return decoded
    } catch (err) {
        return false
    }
}

const renewPasswordEmail = (username, newPass) => `
    <p><b>Hi ${username}</b></p>
    <p>This is your new password: ${newPass}</p>
    <p>Please change you password after loging in</p>
`

export const sendRewPassword = async (req,res,userName,newPassword) => {
    const options = {
        from: `"Hacker 🐧 " <${adminEmail}>`,
        to: req.body.mail,
        subject: 'Renew password',
        html: renewPasswordEmail(userName, newPassword),
    }
    const transporter =await createTransporter();
    return transporter.sendMail(options, (error) => {
        if (error) {
            console.log(error)
            return res.status(500).send({ message: 'cannot send email' })
        }
        return res.status(200).send({ message: 'email has been sent' })
    })

}
