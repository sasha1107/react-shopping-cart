import { Button } from ".";
import { useAtomValue } from "jotai";
import selectedCartAtom from "@/atoms/cartAtom";

interface Props {
  comformModalOpen: (() => void) | undefined;
}
const TotalPrice = ({ comformModalOpen }: Props) => {
  const selectedCart = useAtomValue(selectedCartAtom);
  const totalPrice = selectedCart.reduce(
    (acc, cur) => acc + cur.product.price * cur.quantity,
    0
  );
  return (
    <article className="flex flex-col w-full md:p-0 px-2 py-4">
      <h3 className="border-b w-full">결제예상금액</h3>
      <div className="flex justify-between">
        <div className="underline decoration-primary-400 decoration-4 underline-offset-[-2px]">
          총 상품금액
        </div>
        <div className="underline decoration-primary-400 decoration-4 underline-offset-[-2px]">
          {totalPrice.toLocaleString("ko-KR")}원
        </div>
      </div>
      <div>
        <Button
          type="primary"
          block
          disabled={selectedCart.length === 0}
          onClick={() => {
            comformModalOpen?.();
          }}
        >
          주문하기
        </Button>
      </div>
    </article>
  );
};

export default TotalPrice;
