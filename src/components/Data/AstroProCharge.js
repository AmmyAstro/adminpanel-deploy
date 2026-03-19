const AstroProCharge = [
  {
    id: "call",
    label: "Call/Chat",
    fields: [
      {
        label: "Call/Chat Charges",
        prefix: "Rs.",
        name: "charges.callChatCharges",
        max: 500,
      },

      {
        label: "Call/Chat Offer Charges",
        prefix: "Rs.",
        name: "charges.callChatOfferCharges",
        max: 50,
      },
      {
        label: "Call/Chat Commission",
        prefix: "%",
        name: "charges.callChatCommission",
        max: 50,
      },
    ],
  },
  {
    id: "live",
    label: "Live Call",
    fields: [
      {
        label: "Video Call",
        prefix: "Rs.",
        name: "charges.videocall_charges",
        max: 500,
      },
      {
        label: "Audio Call",
        prefix: "Rs.",
        name: "charges.audiocall_charges",
        max: 50,
      },
         {
        label: "Audio/Video Call Offer Charges",
        prefix: "Rs.",
        name: "charges.audiovideocall_offer_charges",
        max: 50,
      },
      // { label: "Gift ", prefix: "%", name: "charges.gift_commission", max: 50 },

    ],
  },


];

export default AstroProCharge;
