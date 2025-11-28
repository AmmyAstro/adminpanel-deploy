import cookieHelper from "@/app/helper/cookieHelper";

const apiurl = "http://localhost:5000/api";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5002/api/";
const API_AUTH_URL = process.env.NEXT_PUBLIC_API_AUTH_URL || "http://localhost:5003/api/";
const PAYMENT_MICRO = process.env.NEXT_PUBLIC_PAYMENT_MICRO || "http://localhost:5005/api/";
const CHAT_MICRO = process.env.NEXT_PUBLIC_CHAT_MICRO || "http://localhost:8001/api/";




const mainurl="https://newsite-cvo9.onrender.com/";






const apiroute = {
  banneradd: `${apiurl}/banneradd`,
  addGift: `${apiurl}/addGift`,
  AdminLogin: `${apiurl}/login`,
  addTestimonial: `${apiurl}/testimonials/`,
  editTestimonial: (id) => `${apiurl}/testimonials/${id}`,

  couponAdd: `${apiurl}/coupons/add`,
  couponFetch: `${apiurl}/coupons`,

    // package
    packageAdd: `${PAYMENT_MICRO}add/package`,
    ASTROLOGER_LIST: `${API_BASE_URL}astrologerlist`,
    ASTROLOGER_ACCOUNT_ACTIVE: `${API_BASE_URL}astrologer/accountactive`,
    ASTROLOGER_PROFILE:`${API_BASE_URL}astro/profile`,
    CHAT_HISTORY:`${CHAT_MICRO}astrologer/chat_history`,
    FETCH_PACKAGE:`${PAYMENT_MICRO}adminpanelpackage`,
    PACKAGE_STATUS:`${PAYMENT_MICRO}update/package`,
    CALL_HISTORY:`${CHAT_MICRO}call/history`,

     GET_HISTORY :`${API_AUTH_URL}astro_gift`,
     WALLET_HISTORY:`${CHAT_MICRO}wallet_history`,
     ASTROLOGER_TAG:`${API_BASE_URL}tag/update`,

}

const AuthHeader= ()=>{
  const token =cookieHelper.get("token");

  return token;
}





export { apiroute,mainurl,AuthHeader }
