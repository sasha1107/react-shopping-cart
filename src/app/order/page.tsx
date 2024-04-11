import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { Footer, Button, Modal } from "@/components";
import { useLoadNearPayments } from "near-payments";
import type { PaymentCancel, PaymentResult } from "near-payments";
import { ICart } from "@/types";
import type { ModalRef } from "@/components";
import { ERROR_MSG } from "@/constants";

const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const modalRef = useRef<ModalRef | null>(null);
  const [message, setMessage] = useState<string>("");
  const { selectedCart: data }: { selectedCart: ICart[] } = location.state;

  const loadNearPayments = useLoadNearPayments({
    clientId: import.meta.env.VITE_CLIENT_ID,
  });

  const openPayments = async () => {
    try {
      await loadNearPayments({
        orderId: window.crypto.randomUUID(),
        totalAmount: totalPrice,
        onPaymentComplete: (paymentResult: PaymentResult) => {
          if (paymentResult.success) {
            setMessage(paymentResult.message);
          } else {
            throw new Error(paymentResult.message);
          }
        },
        onPaymentCancel: (paymentCancel: PaymentCancel) => {
          if (paymentCancel.success) {
            setMessage(paymentCancel.message);
          } else {
            throw new Error(paymentCancel.message);
          }
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        setMessage(ERROR_MSG[error.message] ?? error.message);
      }
    } finally {
      modalRef.current?.open();
    }
  };
  const totalPrice = data.reduce(
    (acc, cur) => acc + cur.product.price * cur.quantity,
    0
  );
  return (
    <>
      <section>
        <h2 className="border-b-2 border-secondary-700 text-center text-xl pb-2 font-bold">
          주문/결제
        </h2>
        <div className="grid md:grid-cols-2">
          <div className="px-4 py-8">
            <div className="border-b-2 border-secondary-500 py-2 text-lg font-bold">
              주문상품 ({data.length}건)
            </div>
            <ol className="flex flex-col divide-y">
              {data?.map(({ product, quantity, id: cartId }) => {
                const { name, imageUrl } = product;
                return (
                  <li key={cartId} className="py-2">
                    <div className="flex gap-3">
                      <img
                        src={imageUrl}
                        alt={name}
                        className="aspect-square w-36"
                      />
                      <div className="flex flex-col gap-3">
                        <span className="text-lg">{name}</span>
                        <span>수량: {quantity}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
          <div className="hidden md:flex h-max border flex-col">
            <div className="border-b px-2 py-4">결제금액</div>
            <div className="px-2 py-4">
              <div className="flex justify-between">
                <div className="underline decoration-primary-400 decoration-4 underline-offset-[-2px]">
                  총 상품금액
                </div>
                <div className="underline decoration-primary-400 decoration-4 underline-offset-[-2px]">
                  {totalPrice.toLocaleString("ko-KR")}원
                </div>
              </div>
              <Button type="primary" block onClick={openPayments}>
                {totalPrice.toLocaleString("ko-KR")}원 결제하기
              </Button>
            </div>
          </div>
        </div>
        <Footer className="md:hidden p-8">
          <Button type="primary" block onClick={openPayments}>
            {totalPrice.toLocaleString("ko-KR")}원 결제하기
          </Button>
        </Footer>
      </section>
      <Modal ref={modalRef}>
        <div className="flex flex-col gap-4 p-8">
          <h2 className="text-lg">{message}</h2>
          <Button
            block
            type="primary"
            onClick={(e) => {
              modalRef.current?.close();
              e.stopPropagation();
              navigate("/");
            }}
          >
            홈으로
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default Order;
