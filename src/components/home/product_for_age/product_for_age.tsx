import { useState } from "react";
import Slider, { CustomArrowProps } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
    id: number;
    name: string;
    image: string;
    price: number;
    oldPrice?: number;
    discount?: number;
    package: string;
}

interface Category {
    id: string;
    name: string;
    image: string;
}

const categories: Category[] = [
    { id: "kids", name: "Trẻ em", image: "https://i.imgur.com/w0ltsqF.png" },
    { id: "mom", name: "Mẹ và bé", image: "https://i.imgur.com/AJHFtoL.png" },
    { id: "old", name: "Người cao tuổi", image: "https://i.imgur.com/PDtX6oA.png" },
    { id: "diabetes", name: "Người tiểu đường", image: "https://i.imgur.com/Nv4hnxI.png" },
];

const products: Record<string, Product[]> = {
    kids: [
        { id: 1, name: "Siro Brauer Baby Kids Liquid Calcium With Magnesium And Zinc 200ml hỗ trợ xương, răng chắc khỏe", image: "/images/soki-tium.png", price: 264000, oldPrice: 330000, discount: 20, package: "Hộp 12 Gói x 3g" },
        { id: 2, name: "Immune Defence", image: "/images/probiotic.png", price: 550000, package: "Hộp x 45ml" },
        { id: 3, name: "Soki Novo", image: "/images/soki-novo.png", price: 292000, oldPrice: 365000, discount: 20, package: "Hộp 18 Gói x 3g" },
        { id: 4, name: "Soki Novo", image: "/images/soki-novo.png", price: 292000, oldPrice: 365000, discount: 20, package: "Hộp 18 Gói x 3g" },
        { id: 5, name: "Soki Novo", image: "/images/soki-novo.png", price: 292000, oldPrice: 365000, discount: 20, package: "Hộp 18 Gói x 3g" },
        { id: 6, name: "Soki Novo", image: "/images/soki-novo.png", price: 292000, oldPrice: 365000, discount: 20, package: "Hộp 18 Gói x 3g" },
        { id: 7, name: "Soki Novo", image: "/images/soki-novo.png", price: 292000, oldPrice: 365000, discount: 20, package: "Hộp 18 Gói x 3g" },
        { id: 8, name: "Soki Novo", image: "/images/soki-novo.png", price: 292000, oldPrice: 365000, discount: 20, package: "Hộp 18 Gói x 3g" },
        { id: 9, name: "Soki Novo", image: "/images/soki-novo.png", price: 292000, oldPrice: 365000, discount: 20, package: "Hộp 18 Gói x 3g" },
        { id: 10, name: "Soki Novo", image: "/images/soki-novo.png", price: 292000, oldPrice: 365000, discount: 20, package: "Hộp 18 Gói x 3g" },
    ],
    mom: [
        { id: 1, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 2, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 3, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 4, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 5, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 6, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 7, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 8, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 9, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 10, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
    ],
    old: [
        { id: 1, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 2, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 3, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 4, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 5, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 6, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 7, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 8, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 9, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 10, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
    ],
    diabetes: [
        { id: 1, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 2, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 3, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 4, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 5, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 6, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 7, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 8, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 9, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 10, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 11, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 12, name: "Sữa tiểu đường", image: "/images/milk-diabetes.png", price: 450000, package: "Hộp 850g" },
    ],
};

// ✅ Component nút Prev
const PrevArrow: React.FC<CustomArrowProps> = ({ onClick, currentSlide }) => {
    return currentSlide !== 0 ? (
        <button
            onClick={onClick}
            className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white text-blue-500 p-2 rounded-full shadow-md hover:bg-gray-300 transition z-10"
        >
            <ChevronLeft size={24} />
        </button>
    ) : null;
};

// ✅ Component nút Next
const NextArrow: React.FC<CustomArrowProps> = ({ onClick, currentSlide, slideCount }) => {
    return slideCount && currentSlide !== slideCount - 5 ? (
        <button
            onClick={onClick}
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white text-blue-500 p-2 rounded-full shadow-md hover:bg-gray-300 transition z-10"
        >
            <ChevronRight size={24} />
        </button>
    ) : null;
};

export default function ProductForAge() {
    const [selectedCategory, setSelectedCategory] = useState<string>("kids");

    // Lấy danh sách sản phẩm dựa trên danh mục được chọn
    const productList = products[selectedCategory] || [];

    // Cấu hình Slider
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: Math.min(5, productList.length), // Hiển thị max 5 sản phẩm, hoặc ít hơn nếu không đủ
        slidesToScroll: 5,
        arrows: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 800,  // Dưới 768px
                settings: {
                    slidesToShow: Math.min(4, productList.length),
                    slidesToScroll: 4,
                    arrows:false,
                }
            },
            {
                breakpoint: 500,  // Dưới 768px
                settings: {
                    slidesToShow: Math.min(2.25, productList.length),
                    slidesToScroll: 2,
                    arrows:false,
                }
            },
        ]
    };

    return (
        <div className="w-4/5 md-lg:w-11/12 tb:w-11/12 mx-auto container bg-gray-100 mt-5 rounded-xl relative">
            {/* Tiêu đề */}
            <div className="flex items-center gap-2 mb-4 text-black font-bold text-lg">
                <span className="text-blue-600 text-2xl">👨‍👩‍👧‍👦</span> Sản phẩm theo đối tượng
            </div>
            {/* Tabs chọn danh mục */}
            <div className="flex gap-2 mb-6 tb:flex-wrap">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        className={`px-4 py-2 rounded-full border ${selectedCategory === category.id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-black"
                            }`}
                        onClick={() => setSelectedCategory(category.id)}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            {/* Hiển thị ảnh danh mục được chọn */}
            <div className="flex tb:flex-col mb-4 h-[475px] tb:h-full">
                <div className="w-1/6 tb:w-full h-full tb:h-[235px]">
                    {categories.find((c) => c.id === selectedCategory) && (
                        <img
                            src={categories.find((c) => c.id === selectedCategory)?.image}
                            alt={selectedCategory}
                            loading="lazy"
                            className="w-full h-full object-cover rounded-lg"
                        />
                    )}
                </div>

                {/* Slider hiển thị sản phẩm */}
                <div className="w-5/6 tb:w-full tb:mt-5 relative h-full">
                    <Slider {...settings}>
                        {productList.map((product) => (
                            <div key={product.id} className="px-2 h-[475px]">
                                <div className="bg-white p-4 rounded-lg  hover:shadow-lg transition-shadow duration-300 h-full">
                                    {product.discount && (
                                        <span className="absolute bg-red-500 text-white text-xs px-2 py-1 rounded-tl-lg">
                                            -{product.discount}%
                                        </span>
                                    )}
                                    <img
                                        src={product.image}
                                        alt='age'
                                        loading="lazy"
                                        className="w-full h-44 object-contain"
                                    />
                                    <div className="w-full mt-2 h-16 text-black font-semibold text-sm overflow-hidden text-ellipsis">
                                        <p className="line-clamp-3">
                                            {product.name}
                                        </p>
                                    </div>
                                    <div className="h-36">
                                        <p className="text-blue-600 text-lg font-semibold">
                                            {product.price.toLocaleString()}đ / Hộp
                                        </p>
                                        {product.oldPrice && (
                                            <p className="text-gray-400 line-through text-sm">
                                                {product.oldPrice.toLocaleString()}đ
                                            </p>
                                        )}
                                        <p className="text-gray-500 text-xs bg-gray-200 px-2 py-1 inline-block rounded">
                                            {product.package}
                                        </p>
                                    </div>
                                    <button className="mt-2 w-full bg-blue-600 text-white py-2 rounded-full">
                                        Chọn mua
                                    </button>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    );
}
