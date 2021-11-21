import nodeMailer from 'nodemailer';
import jwt from 'jsonwebtoken'

const adminEmail = 'emailsenderfromhcmus@gmail.com'
const adminPassword = 'adminAdm1n'
const mailHost = 'smtp.gmail.com'
const mailPort = 465
const localHost = 'http://localhost:8080'

const transporter = nodeMailer.createTransport({
    auth: {
        user: adminEmail,
        pass: adminPassword
    },
    host: mailHost,
    port: mailPort,
    secure: true
})

const emailTemplate = (username, link) => `
    <p><b>From ${username}</b></p>
    <p>Click the link to join class: ${link}</p>
`
export const generate = (email, courseId,teacherId) => {
    const date = new Date();
    date.setHours(date.getHours() + 1);
    return jwt.sign({ email, courseId,teacherId, expiration: date }, process.env.JWT_SECRET_KEY);
}

export const sendInvitationLink = (req, res) => {
    const { email, courseId,teacherId, name } = req.body;
    const token = generate(email,courseId,teacherId);

    const invitationLink = `${localHost}/courses/joinClass?token=${token}`;

    const options = {
        from: `"Hacker 🐧 " <${adminEmail}>`,
        to: email,
        subject: 'Invitation',
        html: emailTemplate(name, invitationLink)
    }

    return transporter.sendMail(options, error => {
        if (error) {
            console.log(error)
            return res.status(500).send({ message: 'cannot send email' });
        }
        return res.status(200).send({ message: 'email has been sent' });
    })
}

export const validateInvitationLink =  ({ token }) => {
    // jwt.verify(token, process.env.JWT_SECRET_KEY, (err, verifiedJwt) => {
    //     if (err) {
    //         return false;
    //     } else {
    //         return verifiedJwt;
    //     }
    // });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        return decoded;
      } catch(err) {
        return false;
      }
}