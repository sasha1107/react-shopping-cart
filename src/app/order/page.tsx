import { useLocation } from "react-router-dom";
const Order = () => {
  const location = useLocation();
  // const setSelectedCart = useSetAtom(selectedCartAtom);
  console.log(location.state);

  return <div>Order</div>;
};

export default Order;
