 const AstroProfiledata = [
  {
    id: "call",
    label: "Call History",
    fields: [
      { label: "Call/Chat Charges", prefix: "Rs.", name: "callCharges", max: 500 },
      { label: "Call/Chat Commission", prefix: "%.", name: "callCommission", max: 50 },
    ],
  },
  {
    id: "video",
    label: "Chat History",
    fields: [
      { label: "Video Call Charges", prefix: "Rs.", name: "astro_video_charges", max: 500 },
      { label: "Video Call Commission", prefix: "%.", name: "video_commission", max: 50 },
    ],
  },
  {
    id: "offer",
    label: "Order History",
    fields: [
      { label: "Offer Call Charges", prefix: "Rs.", name: "offercallcharges", max: 500 },
      { label: "Offer Video Commission", prefix: "%.", name: "offervideocharges", max: 50 },
      { label: "Offer Chat Charges", prefix: "Rs.", name: "disc_chat_charge", max: 50 },
    ],
  },
  {
    id: "gift",
    label: "Live History",
    fields: [
      { label: "Gift Commission", prefix: "%.", name: "gift_commission", max: 50 },
    ],
  },
  {
    id: "shop",
    label: "DhwaniShop",
    fields: [
      { label: "Gift Commission", prefix: "%.", name: "gift_commission", max: 50 },
    ],
  },
];
export default AstroProfiledata;