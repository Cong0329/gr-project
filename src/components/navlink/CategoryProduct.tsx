
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { resetProduct } from "../../redux/productSlice";
export interface CategoryProductProps {
  id: number;
  name: string;
  image: string;
  price: number;
  slug: string;
  label: string;
  discounted_price: number;
}



export const CategoryProduct = ({ products, parent }: { products: CategoryProductProps[]; parent: string }) => {
  const dispatch = useDispatch();
  return (
    <div className="">
      <div className="flex items-center">
        <p className="text-[16px] font-bold my-4">Bán chạy nhất</p>
        <span className="border-l-2 border-gray-300 mx-2 h-4"></span>
        <Link to={`/medicine-search/?category=${parent}`} className="flex">
          <p className="my-4 text-blue-700">Xem thêm</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 m-auto text-blue-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
      <div className="grid grid-cols-5 gap-2 w-full">
        {products.map((product: CategoryProductProps) => (
          <Link to={`/medicine-detail/${product.slug}`} key={product.id} onClick={() => dispatch(resetProduct())}>
            <div className="flex flex-col items-start" key={product.id}>
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                className="w-32 h-32 bg-white rounded-lg p-4"
              />
              <div className="w-full mt-2 h-16 text-sm overflow-hidden text-ellipsis">
                <p className="line-clamp-3">{product.name}</p>
              </div>

              {product.discounted_price > 0 ? (
                <>
                  <div className="flex">
                    <span className="mt-1 font-bold text-blue-700 mr-1">
                      {Number(product.discounted_price).toLocaleString()} đ
                    </span>
                    <span className="text-blue-700 mt-1 text-sm">/ {product.label}</span>
                  </div>
                  <div className="flex text-gray-500">
                    <span className="mr-1">
                      {Number(product.price).toLocaleString()} đ
                    </span>
                    <span className="text-sm">/ {product.label}</span>
                  </div>
                </>
              ) : (
                <div className="flex">
                  <span className="mt-1 font-bold text-blue-700 mr-1">
                    {Number(product.price).toLocaleString()} đ
                  </span>
                  <span className="text-blue-700 mt-1 text-sm">/ {product.label}</span>
                </div>
              )}

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
