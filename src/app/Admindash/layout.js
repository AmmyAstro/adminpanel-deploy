import Header from "@/components/Header/Header";

import Footer from "@/components/Footer/Footer";
import ClientSideLayout from "./CllientSideLayout";
import ProtectedRoute from "@/components/Custom/ProtectedRoute";

export default function AdminLayout({ children }) {
  return (
    <>
      <ProtectedRoute>
        <Header />
        <ClientSideLayout>{children}</ClientSideLayout>
        <Footer />
      </ProtectedRoute>
    </>
  );
}
