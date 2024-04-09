import { IProduct } from "@/types";
import { ICart } from "@/types/cart";

const getCartData = () => {
  const cartData = localStorage.getItem("cart") || "[]";
  return JSON.parse(cartData) as ICart[];
};
const addToCart = (product: IProduct) => {
  const data: ICart[] = getCartData();
  const exist = data.find((item) => item.product.id === product.id);
  if (exist) {
    const newData = data.map((item) => {
      if (item.product.id === product.id) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    localStorage.setItem("cart", JSON.stringify(newData));
    return;
  }

  const newData = [
    ...data,
    { id: window.crypto.randomUUID(), product, quantity: 1 },
  ];
  localStorage.setItem("cart", JSON.stringify(newData));
};

const deleteProductFromCart = (productId: ICart["product"]["id"]) => {
  const data: ICart[] = getCartData();
  const newData = data.filter((item) => item.product.id !== productId);
  localStorage.setItem("cart", JSON.stringify(newData));
};

export { addToCart, getCartData, deleteProductFromCart };
