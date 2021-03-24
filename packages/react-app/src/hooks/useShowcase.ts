import { useContext } from "react";
import { ShowcaseContext } from "../context/ShowcaseProvider";

const useShowcase = () => {
  const [showcase, dispatchOd] = useContext(ShowcaseContext);
  return { showcase, dispatchOd };
};

export default useShowcase;
