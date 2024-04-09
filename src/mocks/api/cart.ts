import { HttpResponse, delay } from "msw";
import { pagination } from "@/utils";
import { addToCart, getCartData, deleteProductFromCart } from "@/utils/cart";
import type { ICart, IProduct } from "@/types";

const getCarts = async (page: number, limit: number) => {
  try {
    const cartData = getCartData();
    const paginatedData = pagination<ICart>(cartData, page, limit);

    await delay(500);
    return HttpResponse.json({
      ok: true,
      data: paginatedData,
      page: {
        total: cartData.length,
        page,
        limit,
      },
    });
  } catch (error) {
    return HttpResponse.error();
  }
};

const postCart = async (product: IProduct) => {
  try {
    addToCart(product);
    await delay(500);
    return HttpResponse.json(
      {
        data: product,
        code: "ITEM_ADDED_TO_CART",
        ok: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return HttpResponse.error();
  }
};
const changeQuantity = async (productId: IProduct["id"], quantity: number) => {
  try {
    const cartData = getCartData();
    const updatedData = cartData.map((item) => {
      if (item.product.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });

    localStorage.setItem("cart", JSON.stringify(updatedData));
    await delay(500);
    return HttpResponse.json({
      ok: true,
      data: updatedData.find((item) => item.product.id === productId),
    });
  } catch (error) {
    return HttpResponse.error();
  }
};
const deleteCartItem = async (productId: IProduct["id"]) => {
  try {
    deleteProductFromCart(productId);
    await delay(500);
    return HttpResponse.json(productId);
  } catch (error) {
    return HttpResponse.error();
  }
};

export { getCarts, postCart, deleteCartItem, changeQuantity };
