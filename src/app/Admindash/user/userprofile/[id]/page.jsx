// app/admin/users/[id]/page.jsx

import UserProfile from "../../UserProfile";


export default async function Page({
  params,
}) {
  const { id } = await params;

  return (
    <UserProfile userId={id} />
  );
}