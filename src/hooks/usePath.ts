import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const usePath = (fileName: string) => {
  return useQuery({
    queryKey: ["path", fileName],
    queryFn: () =>
      axios.get("http://localhost:3001/api/data", {
        params: {
          parameter: fileName,
        },
      }).then(res => res.data),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: false,
    retry: false,
  });
};

export default usePath;
