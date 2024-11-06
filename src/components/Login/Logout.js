import { CircularProgress } from "@mui/material";
import React, { useEffect } from "react";

function Logout() {
  useEffect(() => {
    setTimeout(() => {
      window.sessionStorage.removeItem("username");
      window.sessionStorage.removeItem("userid");
      window.sessionStorage.removeItem("role");
      window.sessionStorage.removeItem("access-token");
      window.sessionStorage.removeItem("id");
      window.sessionStorage.removeItem("addressselected")
      window.sessionStorage.removeItem("isAdmin");
      window.sessionStorage.removeItem("productId")
      window.location.href = "/login";
    }, 2000);
  }, []);
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <CircularProgress />
        <p className="sm:text-2xl">Logging out.....</p>
      </div>
    </div>
  );
}

export default Logout;