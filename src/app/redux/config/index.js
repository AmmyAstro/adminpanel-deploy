
const apiurl = "http://localhost:5000/api";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5002/api/";
const API_AUTH_URL = process.env.NEXT_PUBLIC_API_AUTH_URL || "http://localhost:5003/api/";
const PAYMENT_MICRO = process.env.NEXT_PUBLIC_PAYMENT_MICRO || "http://localhost:5005/api/";
const CHAT_MICRO = process.env.NEXT_PUBLIC_CHAT_MICRO || "http://localhost:8001/api/";

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

}

const AuthHeader= ()=>{
  const token =cookieHelper.get("token");

  return token;
}





export { apiroute,AuthHeader }