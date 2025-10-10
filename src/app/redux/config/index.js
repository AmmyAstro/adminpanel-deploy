
const apiurl = "http://localhost:5000/api";


const apiroute = {
    banneradd: `${apiurl}/banneradd`,
    addGift: `${apiurl}/addGift`,
    AdminLogin: `${apiurl}/login`,
    addTestimonial: `${apiurl}/testimonials/`,
  editTestimonial: (id) => `${apiurl}/testimonials/${id}`,

  couponAdd: `${apiurl}/coupons/add`,
  couponFetch: `${apiurl}/coupons`,

  // package
  packageAdd: `${apiurl}/packageAdd`,

}

export { apiroute }