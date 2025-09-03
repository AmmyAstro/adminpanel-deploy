"use client";

export default function RazorSidebar() {
  const menuItems = [
    "razor1 ",
    "razor2 ",
    "razor3 ",
    "razor4 ",
    "razor5 ",
    "razor6 ",
    "Settings",
  ];

  return (
    <aside className="h-screen w-20 md:w-48 bg-[#2c0a4d] text-yellow-400 flex flex-col items-center py-6 space-y-6">
      {menuItems.map((item, index) => (
        <div
          key={index}
          className="cursor-pointer w-full text-center md:text-left md:px-4 py-2 rounded-lg hover:bg-yellow-500 hover:text-white transition"
        >
          <span className="hidden md:inline">{item}</span>
          <span className="md:hidden text-sm">{item[0]}</span>
        </div>
      ))}
    </aside>
  );
}
