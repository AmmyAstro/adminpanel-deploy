export const mapAstrologerPayload = (formData) => {
  return {
    astroname: formData.astroname,
    displayName: formData.displayName,

    gender: formData.gender,
    email: formData.email,

    phoneNumber: String(formData.phoneNumber),
    password: formData.password,

    experience: Number(formData.experience),

    expertise: formData.expertise,
    languages: formData.languages,
    problems: formData.problems,

    aboutEnglish: formData.aboutEnglish,

    tags: formData.tags,
    vtags: formData.vtags,

    pricing: formData.pricing
      .filter((p) => p.isActive) 
      .map((p) => ({
        type: p.type,
        price: Number(p.price),
        offerPrice: p.offerPrice ? Number(p.offerPrice) : null,
        commissionPercent: p.commissionPercent
          ? Number(p.commissionPercent)
          : null,
        isActive: p.isActive,
      })),

    address: {
      street: formData.address,
      city: formData.countryStateCity.city,
      state: formData.countryStateCity.state,
      country: formData.countryStateCity.country,
      pincode: String(formData.pincode),
    },

    bankDetails: {
      accountHolderName: formData.bankDetails.accountHolderName,
      accountNumber: formData.bankDetails.accountNumber,
      bankName: formData.bankDetails.bankName,
      ifscCode: formData.bankDetails.ifscCode,
      panCardNumber: formData.bankDetails.panCardNumber,
      branchName: formData.bankDetails.branchName,
    },
    documents: {
      aadhaar: formData.documents?.aadhaar || null,
      panCard: formData.documents?.panCard || null,
      passbook: formData.documents?.passbook || null,
      profilePic: formData.documents?.profilePic || null,
    },
  };
};
