import Spinner from "@/assets/spinner.svg?react";
import { useEffect, useRef } from "react";
import { useCarts, useDeleteCartItem, useChangeQuantity } from "@/api";
import { useIntersectionObserver } from "@/hooks";
import {
  Loading,
  Checkbox,
  Footer,
  TotalPrice,
  Modal,
  Button,
} from "@/components";
import selectedCartAtom from "@/atoms/cartAtom";
import { useAtom } from "jotai";
import type { ModalRef } from "@/components";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetching } =
    useCarts();
  const modalRef = useRef<ModalRef | null>(null);
  const confirmModalRef = useRef<ModalRef | null>(null);
  const { ref, isIntersecting } = useIntersectionObserver();
  const { mutate: deleteCartItem } = useDeleteCartItem(modalRef.current?.open);
  const { mutate: changeQuantity } = useChangeQuantity();
  const [selectedCart, setSelectedCart] = useAtom(selectedCartAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, fetchNextPage, hasNextPage]);

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <div>Error</div>;
  }
  return (
    <>
      <section className="pb-[73px] md:pb-0">
        <h2 className="border-b-2 border-secondary-700 text-center text-xl pb-2">
          장바구니
        </h2>
        <div className="grid grid-cols-2">
          <div className="col-span-2 md:col-span-1">
            <div className="flex gap-4 items-center">
              <Checkbox
                id="all"
                checked={
                  data?.pages
                    .flatMap((item) => item.data)
                    .every((item) =>
                      selectedCart.some((cart) => cart.id === item.id)
                    ) ?? false
                }
                onChange={(e) => {
                  setSelectedCart(
                    e.target.checked
                      ? data?.pages.flatMap((item) => item.data) ?? []
                      : []
                  );
                }}
              />
              <label htmlFor="all">선택 해제</label>
            </div>
            <ol className="flex flex-col divide-y">
              {data?.pages
                .flatMap((item) => item.data)
                .map(({ product, quantity, id: cartId }) => {
                  const { id, name, imageUrl, price } = product;
                  return (
                    <li key={id}>
                      <div className="flex gap-3">
                        <Checkbox
                          id={`${id}`}
                          checked={selectedCart.some(
                            (item) => item.id === cartId
                          )}
                          onChange={(e) => {
                            setSelectedCart((prev) => {
                              if (e.target.checked) {
                                return [
                                  ...prev,
                                  { product, quantity, id: cartId },
                                ];
                              }
                              return prev.filter((item) => item.id !== cartId);
                            });
                          }}
                        />
                        <img
                          src={imageUrl}
                          alt={name}
                          className="aspect-square w-36"
                        />
                        <div>{name}</div>
                        <div className="flex flex-col justify-between ml-auto">
                          <button
                            onClick={() => {
                              deleteCartItem(id);
                            }}
                          >
                            삭제
                          </button>
                          <input
                            type="number"
                            className="border"
                            value={quantity}
                            max={20}
                            min={1}
                            onChange={(e) => {
                              changeQuantity({
                                productId: id,
                                quantity: +e.target.value,
                              });
                              setSelectedCart((prev) =>
                                prev.map((item) =>
                                  item.id === cartId
                                    ? { ...item, quantity: +e.target.value }
                                    : item
                                )
                              );
                            }}
                          />
                          <div>
                            {(price * quantity).toLocaleString("ko-KR")}원
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              <div ref={ref} />
            </ol>
            {isFetching && (
              <div className="justify-center">
                <Spinner />
              </div>
            )}
          </div>

          <div className="hidden md:flex h-max">
            <TotalPrice comformModalOpen={confirmModalRef.current?.open} />
          </div>
        </div>
        <Footer className="md:hidden">
          <TotalPrice comformModalOpen={confirmModalRef.current?.open} />
        </Footer>
      </section>
      <Modal ref={modalRef}>
        <div className="flex flex-col gap-4 p-8">
          <h2 className="text-lg">상품이 삭제되었습니다.</h2>
          <Button
            block
            onClick={(e) => {
              modalRef.current?.close();
              e.stopPropagation();
            }}
          >
            확인
          </Button>
        </div>
      </Modal>
      <Modal ref={confirmModalRef}>
        <div className="flex flex-col gap-4 p-8">
          <h2 className="text-lg">상품을 주문하시겠습니까?</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={(e) => {
                confirmModalRef.current?.close();
                e.stopPropagation();
              }}
            >
              취소
            </Button>
            <Button
              type="primary"
              onClick={() => {
                navigate("/order", {
                  state: { selectedCart },
                });
              }}
            >
              주문하기
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Cart;
