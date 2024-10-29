import { useEffect } from "react";
import { useRouter } from "next/router";

const MyComponent = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login"); // Redirect to /login immediately on load
  }, []); // Empty dependency array to run only on initial load

  return null; // Optionally return null if there's nothing to render before redirect
};

export default MyComponent;
