import type { IProduct } from "./product";

export type ICart = {
  id: string;
  product: IProduct;
  quantity: number;
};
