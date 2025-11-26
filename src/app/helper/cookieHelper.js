// cookieHelper.js
import Cookies from 'js-cookie';

const cookieHelper = {

  set: (key, value, expiresHours = 1) => {
    const safeValue = typeof value === 'object' ? JSON.stringify(value) : value;
    Cookies.set(key, safeValue, {
      expires: expiresHours / 24, 
      path: '/',
      secure: true,
      sameSite: 'Strict',
    });
  },


  get: (key) => {
    const value = Cookies.get(key);
    try {
      return value ? JSON.parse(value) : null;
    } catch (e) {
      return value || null;
    }
  },

  remove: (key) => {
    Cookies.remove(key, { path: '/' });
  },
};

export default cookieHelper;
