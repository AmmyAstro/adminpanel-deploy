import CallComp from "../Custom/CallComp";
import ChatCom from "../Custom/ChatCom";
import GiftComp from "../Custom/GiftComp";
import Reviewcom from "../Custom/Reviewcom";
import WalletCom from "../Custom/WalletCom";


 const AstroProfiledata = [
   {
    id: "Wallet",
    label: "Wallet History",
      fields:[WalletCom],
   
  },
  {
    id: "call",
    label: "Call History",
    fields: [CallComp],
  },
  {
    id: "video",
    label: "Chat History",
    fields: [ChatCom ],
  },

  {
    id: "gift",
    label: "Gift History",
    fields: [GiftComp],
  },
    {
    id: "review",
    label: "Review History",
    fields:[Reviewcom],
  },
 
];
export default AstroProfiledata;