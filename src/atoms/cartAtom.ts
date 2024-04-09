import { ICart } from "@/types/cart";
import { atom } from "jotai";

const selectedCartAtom = atom<ICart[]>([]);

export default selectedCartAtom;
