import CallComp from "../Custom/CallComp";
import ChatCom from "../Custom/ChatCom";
import GiftComp from "../Custom/GiftComp";
import WalletCom from "../Custom/WalletCom";


 const AstroProfiledata = [
   {
    id: "Wallet",
    label: "Wallet History",
      fields: [
      // eslint-disable-next-line react/jsx-key
      <WalletCom />
     
    ],
   
  },
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
    id: "gift",
    label: "Gift History",
    fields: [
      // eslint-disable-next-line react/jsx-key
      <GiftComp />
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
 
];
export default AstroProfiledata;