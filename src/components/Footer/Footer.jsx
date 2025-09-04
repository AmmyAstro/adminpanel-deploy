import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full flex bg-[#2f1254] text-white md:flex-row flex-col md:justify-evenly p-4 z-50">
      <div className="w-full text-center text-[.7rem] md:text-[.8rem] font-semibold">
        <p>Copyright © 2023. Made with ❤️ by Dhwani Astro.</p>
      </div>
      {/* <SupportChat/> */}
      <div className="mt-2 w-full md:mt-0">
        <ul className="text-[.6rem] md:text-[.8rem] font-semibold flex gap-4 text-yellow-400 justify-center  md:text-right">
          <li>
            <Link href="#">Cookies</Link>
          </li>
          <li>
            <Link href="#">Terms & Conditions</Link>
          </li>
          <li>
            <Link href="#">Privacy Policy</Link>
          </li>
          <li>
            <Link href="#">Support</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
