import Header from "@/components/Header/Header";

import Footer from "@/components/Footer/Footer";
import ClientSideLayout from "./CllientSideLayout";

export default function AdminLayout({ children }) {

  return (
    <>
        <Header />
      <ClientSideLayout>{children}</ClientSideLayout>
      <Footer />
  
    </>
  );
}

