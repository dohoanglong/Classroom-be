import nodeMailer from 'nodemailer'
import jwt from 'jsonwebtoken'
// import prettylink from 'prettylink'
import dotenv from 'dotenv'
dotenv.config()

const adminEmail = 'emailsenderfromhcmus@gmail.com'
const adminPassword = 'adminAdm1n'
const mailHost = 'smtp.gmail.com'
const mailPort = 465
// const url = process.env.NODE_ENV === 'development'
//     ? process.env.REACT_APP_CLIENT_LOCAL : process.env.REACT_APP_CLIENT_PRODUCTION
const transporter = nodeMailer.createTransport({
    auth: {
        user: adminEmail,
        pass: adminPassword,
    },
    host: mailHost,
    port: mailPort,
    secure: true,
})

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

    var link = `${url}/courses/joinClassByLink?token=${token}`

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
