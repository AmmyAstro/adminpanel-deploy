// components/DashboardCards.jsx
"use client";
import Image from "next/image";
import Link from "next/link";

const cards = [
  {
    title: "Razorpay",
    subtitle: "Dashboard",
    img: "/admin-img/gif/razorpay.gif",
    link: "/Admindash/razordash",
    bg: "bg-[#7569b6da]",
  },
  {
    title: "Dhwani",
    subtitle: "Revenue",
    img: "/admin-img/gif/revenue.gif",
    link: "#",
    bg: "bg-[#AD88C6]",
  },
  {
    title: "Astrologers",
    img: "/admin-img/gif/ast.gif",
    link: "/astrologer",
    bg: "bg-[#C683D7]",
  },
  {
    title: "Customers",
    img: "/admin-img/gif/1.gif",
    link: "/Customer/customer",
    bg: "bg-[#a682a7ce]",
  },
  {
    title: "Dhwani",
    subtitle: "Shop",
    img: "/admin-img/gif/shop.gif",
    link: "/Dshop/dshop",
    bg: "bg-[rgba(164,76,211,0.404)]",
  },
  {
    title: "Recommended",
    subtitle: "Products",
    img: "/admin-img/gif/like.gif",
    link: "#",
    bg: "bg-[#E1AFD1]",
  },
  {
    title: "Notice",
    subtitle: "Board",
    img: "/admin-img/gif/nb.gif",
    link: "#",
    bg: "bg-[#7569b6da]",
  },
  {
    title: "Live",
    subtitle: "Stream",
    img: "/admin-img/live.gif",
    link: "#",
    bg: "bg-[#AD88C6]",
    rounded: true,
  },
  {
    title: "New Astrologer",
    subtitle: "Hiring",
    img: "/admin-img/grp.gif",
    link: "#",
    bg: "bg-[#C683D7]",
    rounded: true,
  },
  {
    title: "Fraud",
    subtitle: "Flags",
    img: "/admin-img/gif/fraud.gif",
    link: "#",
    bg: "bg-[#a682a7ce]",
  },
  {
    title: "Knowrality",
    subtitle: "Calls",
    img: "/admin-img/cal.gif",
    link: "#",
    bg: "bg-[rgba(164,76,211,0.404)]",
    rounded: true,
  },
  {
    title: "Reviews",
    img: "/admin-img/gif/chat.gif",
    link: "#",
    bg: "bg-[#E1AFD1]",
  },
  {
    title: "Privilege Manager",
    img: "/admin-img/prm.gif",
    link: "/priviman",
    bg: "bg-[#7569b6da]",
    rounded: true,
  },
  {
    title: "Insta/FB",
    subtitle: "Chat",
    img: "/admin-img/insfb.gif",
    link: "#",
    bg: "bg-[#AD88C6]",
    rounded: true,
  },
  {
    title: "Push",
    subtitle: "Notification",
    img: "/admin-img/gif/noti.gif",
    link: "/PushNo/pushnoti",
    bg: "bg-[#C683D7]",
  },
  {
    title: "Playstore",
    img: "/admin-img/playstore.gif",
    link: "#",
    bg: "bg-[#a682a7ce]",
    rounded: true,
  },
  {
    title: "Support",
    subtitle: "Chat",
    img: "/admin-img/support.gif",
    link: "#",
    bg: "bg-[rgba(164,76,211,0.404)]",
    rounded: true,
  },
  {
    title: "Astrologer",
    subtitle: "Chat",
    img: "/admin-img/chat.gif",
    link: "#",
    bg: "bg-[#E1AFD1]",
    rounded: true,
  },
];

export default function AdminCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-7 pt-6 h-full px-15 ">
      {cards.map((card, idx) => (
        <Link className="mb-5" key={idx} href={card.link}>
          <div
            className={`h-full flex flex-col items-center justify-center rounded-xl p-6  text-white shadow-lg cursor-pointer transition-transform hover:scale-105 ${card.bg}`}
          >
            <div className="mb-3">
              <Image
                src={card.img}
                alt={card.title}
                width={60}
                height={60}
                className={card.rounded ? "rounded-full" : ""}
              />
            </div>
            <div className="text-center text-[#5a146f]">
              <p className="font-semibold ">{card.title}</p>
              {card.subtitle && (
                <span className="block  text-sm opacity-90">{card.subtitle}</span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
