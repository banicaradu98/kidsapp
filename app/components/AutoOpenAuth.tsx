"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AuthModal from "./AuthModal";

export default function AutoOpenAuth() {
  const params = useSearchParams();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (params.get("login") === "1") setShow(true);
  }, [params]);

  if (!show) return null;
  return <AuthModal onClose={() => setShow(false)} />;
}
