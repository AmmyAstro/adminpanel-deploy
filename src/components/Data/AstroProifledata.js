import CallComp from "../Custom/CallComp";
import ChatCom from "../Custom/ChatCom";


 const AstroProfiledata = [
  {
    id: "call",
    label: "Call History",
    fields: [
      // eslint-disable-next-line react/jsx-key
      <CallComp />
     
    ],
  },
  {
    id: "video",
    label: "Chat History",
    fields: [
     // eslint-disable-next-line react/jsx-key
     <ChatCom />
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