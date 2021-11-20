import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
const CLIENT_ID =
  '1017250446015-7cdiqru941mjct7o9rdoonrjrdbo75ja.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);
export async function verifyGg(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (e) {
    return false;
  }
}

export async function verifyFb(token) {
  const res = await axios.get(
    `https://graph.facebook.com/me?fields=id,email,name&access_token=${token}`
  );
  return res.data;
}
