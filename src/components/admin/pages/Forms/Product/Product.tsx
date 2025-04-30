import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct } from "../../../../../redux/productAsyncThunk";
import { Link } from "react-router-dom";
import { resetProduct } from "../../../../../redux/productSlice";
import { RootState } from "../../../../../redux/store";

export interface Product {
    id: string;
    name: string;
    images: Images[];
    quantity: number;
    brand: Brand;
    options: Options[];
}

interface Brand {
    id: string;
    name: string;
}

interface Options {
    id: string;
    label: string;
    price: number;
    discounted_pricet: number;
}

interface Images {
    id: string;
    image: string;
}



export const Product = ({products, status}: {products: Product[], status: string}) => {
    const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const dispatch = useDispatch();


    const config = {
        name: 'Product',
        pluralName: 'Products',
        tableColumns: [
            { key: 'stt', header: 'STT' },
            { key: 'images', header: 'Hình ảnh' },
            { key: 'name', header: 'Tên' },
            { key: 'quantity', header: 'Số lượng' },
            { key: 'brand', header: 'Thương hiệu' },
            { key: 'options', header: 'Giá' },
        ],
    };

  



    const formatPrice = (price: string | number) => {
        const numberPrice = typeof price === 'string' ? parseFloat(price) : price;
        return numberPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    const handleDelete = () => {
        if (selectedProduct) {
            dispatch(deleteProduct(selectedProduct.id));
            setOpenDeleteModal(false);
        }
    };


    const handleOptionChange = (productId: string, optionIndex: number) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [productId]: optionIndex,
        }));
    };
    return (
        <>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {config.tableColumns.map((column) => (
                            <th
                                key={String(column.key)}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {column.header}
                            </th>
                        ))}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thao tác
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                    {products.length > 0 ? (
                        products.map((product, index) => {
                            const selectedOptionIndex = selectedOptions[product.id] || 0;
                            const selectedOption = product.options?.[selectedOptionIndex];

                            let priceToShow = "-";
                            if (selectedOption) {
                                const discounted = parseFloat(selectedOption.discounted_price);
                                const price = parseFloat(selectedOption.price);
                                priceToShow = formatPrice(discounted > 0 ? discounted : price);
                            }

                            return (
                                <tr key={product.id}>
                                    {config.tableColumns.map((column) => (
                                        <td
                                            key={`${product.id}-${String(column.key)}`}
                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                        >
                                            {(() => {
                                                switch (column.key) {
                                                    case 'stt':
                                                        return index + 1;
                                                    case 'images':
                                                        return product.images && product.images.length > 0 ? (
                                                            <img
                                                                src={product.images[0].image}
                                                                alt={product.name}
                                                                className="h-12 w-12 object-cover rounded"
                                                            />
                                                        ) : (
                                                            '-'
                                                        );
                                                    case 'name':
                                                        return (
                                                            <div className="whitespace-normal break-words max-w-xs">
                                                                {product.name}
                                                            </div>
                                                        );

                                                    case 'brand':
                                                        return product.brand?.name || '-';
                                                    case 'options':
                                                        return product.options && product.options.length > 0 ? (
                                                            <div className="flex items-center space-x-2">
                                                                <select
                                                                    value={selectedOptionIndex}
                                                                    onChange={(e) => handleOptionChange(product.id, Number(e.target.value))}
                                                                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                                                                >
                                                                    {product.options.map((opt, idx) => (
                                                                        <option key={opt.id} value={idx}>
                                                                            {opt.label}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                <span className="font-semibold">{priceToShow}</span>
                                                            </div>
                                                        ) : (
                                                            '-'
                                                        );
                                                    default:
                                                        return (product as any)[column.key] ?? '-';
                                                }
                                            })()}
                                        </td>
                                    ))}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link
                                            to={`/admin/edit-product/${product.id}`}
                                            onClick={() => dispatch(resetProduct())}
                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                        >
                                            Sửa
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setSelectedProduct(product);
                                                setOpenDeleteModal(true);
                                            }}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td
                                colSpan={config.tableColumns.length + 1}
                                className="px-6 py-4 text-center text-sm text-gray-500"
                            >
                                Không có {config.name} nào
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        {openDeleteModal && selectedProduct && (
            <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
                    <h2 className="text-lg font-semibold mb-4">Xác nhận xóa sản phẩm</h2>
                    <p className="mb-6 text-gray-700">
                        Bạn có chắc chắn muốn xóa sản phẩm <span className="font-bold">{selectedProduct.name}</span> không?
                    </p>
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={() => setOpenDeleteModal(false)}
                            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                        >
                            Xóa
                        </button>
                    </div>
                </div>
            </div>
        )}

          {status === "loading" &&
            <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-50">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-white text-sm">Đang thực hiện...</p>
                </div>
            </div>
        }
    </>
    )
}