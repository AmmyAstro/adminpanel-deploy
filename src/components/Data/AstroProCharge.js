const AstroProCharge = [
  {
    id: "call",
    label: "Call/Chat",
    fields: [
      { label: "Call/Chat Charges", prefix: "Rs.", name: "callCharges", max: 500 },
      { label: "Call/Chat Commission", prefix: "%.", name: "callCommission", max: 50 },
    ],
  },
  {
    id: "video",
    label: "Video Call",
    fields: [
      { label: "Live Streaming", prefix: "Rs.", name: "astro_video_charges", max: 500 },
      { label: "Live Call", prefix: "%.", name: "video_commission", max: 50 },
      { label: "Video Call", prefix: "%.", name: "video_commission", max: 50 },

    ],
  },
  {
    id: "offer",
    label: "Offer Price",
    fields: [
      { label: "Offer Call Charges", prefix: "Rs.", name: "offercallcharges", max: 500 },
      { label: "Offer Video Commission", prefix: "%.", name: "offervideocharges", max: 50 },
      { label: "Offer Chat Charges", prefix: "Rs.", name: "disc_chat_charge", max: 50 },
    ],
  },
  {
    id: "gift",
    label: "Gift",
    fields: [
      { label: "Gift Commission", prefix: "%.", name: "gift_commission", max: 50 },
    ],
  },
];
export default AstroProCharge;