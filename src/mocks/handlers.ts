import { http, HttpResponse } from "msw";
import { IProduct } from "@/types/product";
import { getProduct, getProducts } from "@/mocks/api/product";
import {
  getCarts,
  postCart,
  deleteCartItem,
  changeQuantity,
} from "@/mocks/api/cart";

export const handlers = [
  http.get("/products", ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get("page");
    const limit = url.searchParams.get("limit");
    return getProducts(Number(page), Number(limit));
  }),

  http.get("/products/:id", ({ params }) => {
    const { id } = params;
    return getProduct(`${id}`);
  }),

  http.get("/carts", ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get("page");
    const limit = url.searchParams.get("limit");
    return getCarts(Number(page), Number(limit));
  }),

  http.post("/carts", async ({ request }) => {
    const body = await request.json();
    if (!body) {
      return new HttpResponse("Bad request", {
        status: 400,
      });
    }
    return postCart(body as IProduct);
  }),
  http.patch("/carts/:productId", async ({ params, request }) => {
    const { productId } = params;
    const { quantity } = (await request.json()) as { quantity: number };
    return changeQuantity(Number(productId), quantity);
  }),
  http.delete("/carts/:productId", ({ params }) => {
    const { productId } = params;
    return deleteCartItem(Number(productId));
  }),
];
