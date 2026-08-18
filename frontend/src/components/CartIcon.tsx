import Image from "next/image";
import Link from "next/link";

type CartIconProp = {
  onClick?: () => void;
};

const CartIcon = ({ onClick }: CartIconProp) => {
  return (
    <Link href="/cart" className="flex gap-1" onClick={onClick}>
      <div className="relative w-8 h-8 md:w-5 md:h-5">
        <Image
          src="/cart.png"
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <span>Cart(3)</span>
    </Link>
  );
};

export default CartIcon;
