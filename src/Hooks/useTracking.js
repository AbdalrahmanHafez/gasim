import { TrackingStoreCtx } from "../Stores/TrackingStore";
import { useContext } from "react";

const useTracking = () => {
  return useContext(TrackingStoreCtx);
};
export default useTracking;
