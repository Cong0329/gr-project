import { Link } from "react-router-dom";
import { Product } from "../../admin/pages/Forms/Product/Product";
import { useDispatch, useSelector } from "react-redux";
import { resetProduct } from "../../../redux/productSlice";
import { addToCartAPI } from "../../../redux/cartAsyncThunk";
import { toast } from "react-hot-toast";
import { RootState, AppDispatch } from "../../../redux/store";
interface PromotionChildProps {
    product: Product;
    handleTypeClick: (type: string, productId: string) => void;
    selectedType: { [key: string]: string };
}

export const PromotionChild: React.FC<PromotionChildProps> = ({ product, handleTypeClick, selectedType }) => {
    const columns = product.options?.length || 0;
    const dispatch: AppDispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);

    // Tìm option đang được chọn theo product.id
    const selectedLabel = selectedType[product.id];
    const selectedOption = product.options?.find(opt => opt.label === selectedLabel) || product.options?.[0] || null;


    const displayPrice = parseFloat(selectedOption.discounted_price) > 0
        ? parseFloat(selectedOption.discounted_price)
        : parseFloat(selectedOption.price);

    const displayDiscountedPrice = parseFloat(selectedOption.discounted_price) > 0
        ? parseFloat(selectedOption.price)
        : null;

    const addToCart = () => {
        if (!user || Object.keys(user).length === 0) {
            toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
            return;
        }
        if (product.quantity > 1) {
            dispatch(addToCartAPI({ product_id: product.id, quantity: 1, option_id: selectedOption.id }));
            toast.success("Thêm vào giỏ hàng thành công");
        } else {
            toast.error("Số lượng sản phẩm không đủ");
        }
    };

    return (
        <div key={product.id} className="item-box border-2 mr-2  rounded-lg bg-white flex flex-col items-center p-4 space-y-2 hover:border-blue-600 transition-all duration-300">
            <Link to={`/medicine-detail/${product.slug}`} onClick={() => dispatch(resetProduct())} >
                <div className="w-full h-40 flex items-center justify-center">
                    <img
                        src={product.images[0].image}
                        alt={product.name}
                        loading="lazy"
                        className="max-h-40 max-w-full object-contain"
                    />
                </div>
                <div className="w-full mt-2 h-16 tb:h-10 text-black font-semibold text-sm overflow-hidden text-ellipsis">
                    <p className="line-clamp-3">{product.name}</p>
                </div>
            </Link>



            <div className={`grid grid-cols-${columns} bg-gray-300 rounded-lg w-full h-9`}>
                {product.options.map((option) => (
                    <button
                        key={option.label}
                        onClick={() => handleTypeClick(option.label, product.id)}
                        className={`capitalize text-[13px] md-lg:text-[10px] mm:text-[9px] font-semibold px-2 ${selectedLabel === option.label
                            ? 'text-blue-700 border border-blue-700 rounded-lg'
                            : 'text-gray-600'
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            <div className='flex-col flex w-full h-10'>
                <div className="flex items-center">
                    <span className="md-lg:text-[10px] font-bold text-blue-700 mr-1 ms:text-[11px]">
                        {displayPrice.toLocaleString()} đ
                    </span>
                    <span className='text-blue-700 md-lg:text-[10px] text-sm capitalize ms:text-[11px]'>/ {selectedOption.label}</span>
                </div>
                {displayDiscountedPrice && (
                    <div className="flex items-center line-through text-sm text-gray-400">
                        <span className="md-lg:text-[10px] font-bold  mr-1 ms:text-[11px] ">
                            {displayDiscountedPrice?.toLocaleString()} đ
                        </span>
                        <span className='md-lg:text-[10px] text-sm capitalize ms:text-[11px]'>/ {selectedOption.label}</span>
                    </div>
                )}
            </div>

            <div className="w-full flex items-start md-lg:h-12">
                <p className="bg-gray-300 p-2 rounded-lg text-[13px] font-semibold md-lg:text-[10px]  text-gray-600">{product.specification}</p>
            </div>

            <button className="bg-blue-700 text-white font-bold py-2 items-center rounded-full w-full text-sm" onClick={addToCart}>
                Chọn mua
            </button>
        </div>
    );
}

