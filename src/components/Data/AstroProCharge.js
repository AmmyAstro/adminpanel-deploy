const AstroProCharge = [
  {
    id: "call",
    label: "Call/Chat",
    fields: [
      { label: "Call/Chat Charges", prefix: "Rs.", name: "charges.callCharges", max: 500 },
      { label: "Call/Chat Commission", prefix: "%", name: "charges.callCommission", max: 50 },
    ],
  },
  {
    id: "live",
    label: "Live Call",
    fields: [
      { label: "Video Call", prefix: "Rs.", name: "charges.videocall_charges", max: 500 },
      { label: "Audio Call", prefix: "Rs.", name: "charges.audiocall_charges", max: 50 },
      { label: "Audio Call Commission", prefix: "Rs.", name: "charges.audiocall_commission", max: 50 },
      { label: "Video Call Commission", prefix: "Rs.", name: "charges.videocall_commission", max: 50 },
    ],
  },
  {
    id: "offers",
    label: "Offer Price",
    fields: [
      { label: "Offer Call Charges", prefix: "Rs.", name: "charges.offercallcharges", max: 500 },
      { label: "Offer Video Charges", prefix: "%", name: "charges.offervideocharges", max: 50 },
      { label: "Offer Chat Charges", prefix: "Rs.", name: "charges.disc_chat_charge", max: 50 },
    ],
  },
  // {
  //   id: "gift",
  //   label: "Gift",
  //   fields: [
  //     { label: "Gift Commission", prefix: "%", name: "charges.gift_commission", max: 50 },
  //   ],
  // },
];



export default AstroProCharge;