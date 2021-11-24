import nodeMailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import prettylink from 'prettylink';

const adminEmail = 'emailsenderfromhcmus@gmail.com';
const adminPassword = 'adminAdm1n';
const mailHost = 'smtp.gmail.com';
const mailPort = 465;
const localHost = 'https://classroom-manager.netlify.app/';
const transporter = nodeMailer.createTransport({
  auth: {
    user: adminEmail,
    pass: adminPassword,
  },
  host: mailHost,
  port: mailPort,
  secure: true,
});

const emailTemplate = (username, link) => `
    <p><b>From ${username}</b></p>
    <p>Click the link to join class: ${link}</p>
`;
const generate = (email, courseId, teacherId, role) => {
  const date = new Date();
  date.setHours(date.getHours() + 1);
  return jwt.sign(
    { email, courseId, teacherId, role, expiration: date },
    process.env.JWT_SECRET_KEY_JOINCLASS
  );
};

export const generateInvitationLinkSendViaEmail = async ({
  email,
  courseId,
  teacherId,
  role,
}) => {
  const token = generate(email, courseId, teacherId, role);
  const bitly = new prettylink.Bitly(process.env.BITLY_SECRET_KEY);
  var link = `${localHost}/courses/joinClass?token=${token}`;
  try {
    link = await bitly.short(link);
  } catch (error) {
    link = error.link; //<<<even I dont know why xD
  }
  return link;
};

export const generateInvitationLink = async ({ courseId, teacherId }) => {
  const token = generate(null, courseId, teacherId);
  const bitly = new prettylink.Bitly(process.env.BITLY_SECRET_KEY);
  var link = `${localHost}/courses/joinClassByLink?token=${token}`;
  try {
    link = await bitly.short(link);
  } catch (error) {
    link = error.link; //<<<even I dont know why xD
  }
  return link;
};

export const sendInvitationLink = async (req, res) => {
  const { email, name } = req.body;

  const invitationLink = await generateInvitationLinkSendViaEmail(req.body);
  const options = {
    from: `"Hacker 🐧 " <${adminEmail}>`,
    to: email,
    subject: 'Invitation',
    html: emailTemplate(name, invitationLink),
  };

  return transporter.sendMail(options, (error) => {
    if (error) {
      console.log(error);
      return res.status(500).send({ message: 'cannot send email' });
    }
    return res.status(200).send({ message: 'email has been sent' });
  });
};

export const validateInvitationLink = ({ token }) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY_JOINCLASS);
    return decoded;
  } catch (err) {
    return false;
  }
};
