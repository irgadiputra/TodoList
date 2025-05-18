"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";
import MyTodosList from "@/pages/my-todos-page";
import Navbar from "@/pages/home-page/components/navbar";

export default function MyEventPage() {
  const auth = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return <div>Loading...</div>;
  }

  if (!auth.token || !auth.isLogin) {
    router.push("/login");
    return null;
  }

  return (
    <>
      <Navbar />
      <MyTodosList />
    </>
  );
}
