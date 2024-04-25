import LoadingSpinner from "../../common/utils/components/LoadingSpinner.tsx";
import useLogout from "../hooks/useLogout.ts";
import {useEffect, useState} from "react";

export default function Logout() {
  const [loading, setLoading] = useState(true);
  const logout = useLogout();
  useEffect(() => {
    logout(true).then(() => {
      setLoading(false);
    });
  }, []);
  return (loading ? <LoadingSpinner/> : null)
}
