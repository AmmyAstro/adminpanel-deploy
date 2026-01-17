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
    id: "video",
    label: "Video Call",
    fields: [
      { label: "Live Streaming", prefix: "Rs.", name: "charges.astro_video_charges", max: 500 },
      { label: "Video Commission", prefix: "%", name: "charges.video_commission", max: 50 },
    ],
  },
  {
    id: "offer",
    label: "Offer Price",
    fields: [
      { label: "Offer Call Charges", prefix: "Rs.", name: "charges.offercallcharges", max: 500 },
      { label: "Offer Video Charges", prefix: "%", name: "charges.offervideocharges", max: 50 },
      { label: "Offer Chat Charges", prefix: "Rs.", name: "charges.disc_chat_charge", max: 50 },
    ],
  },
  {
    id: "gift",
    label: "Gift",
    fields: [
      { label: "Gift Commission", prefix: "%", name: "charges.gift_commission", max: 50 },
    ],
  },
];



export default AstroProCharge;