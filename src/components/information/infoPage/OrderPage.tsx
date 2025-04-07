import { useEffect, useRef, useState } from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { OrderCustom } from './OrderCustom';

export interface Order {
    id: number;
    date: string;
    shippingMethod: string;
    orderId: string;
    status: 'delivered' | 'canceled' | 'pending' | 'delivering' | 'return';
    total: number;
    items: { name: string; price: number; quantity: number }[];
}

export const OrderPage = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
    const [search, setSearch] = useState('');

    const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
    const [isLoading, setIsLoading] = useState(true);

    const orders: Order[] = [
        {
            id: 1,
            date: '01/04/2025',
            shippingMethod: 'Giao hàng tận nơi',
            orderId: '#7212016',
            status: 'canceled',
            total: 948000,
            items: [{ name: 'Thực phẩm bảo vệ sức khỏe OMEGA 3 PLUS', price: 920000, quantity: 1 }]
        },
        {
            id: 2,
            date: '02/04/2025',
            shippingMethod: 'Giao hàng tận nơi',
            orderId: '#7212017',
            status: 'delivered',
            total: 1488000,
            items: [
                { name: 'Thực phẩm chức năng', price: 920000, quantity: 1 },
            ]
        },
        {
            id: 3,
            date: '03/04/2025',
            shippingMethod: 'Giao hàng tận nơi',
            orderId: '#7212018',
            status: 'pending',
            total: 948000,
            items: [{ name: 'Thực phẩm sức khỏe OMEGA 3 PLUS', price: 920000, quantity: 1 }]
        },
        {
            id: 4,
            date: '04/04/2025',
            shippingMethod: 'Giao hàng tận nơi',
            orderId: '#7212019',
            status: 'delivering',
            total: 948000,
            items: [{ name: 'Thuốc bảo vệ sức khỏe OMEGA 3 PLUS', price: 920000, quantity: 1 }]
        },
        {
            id: 5,
            date: '05/04/2025',
            shippingMethod: 'Giao hàng tận nơi',
            orderId: '#7212020',
            status: 'return',
            total: 948000,
            items: [{ name: 'Bảo vệ sức khỏe OMEGA 3 PLUS', price: 920000, quantity: 1 }]
        },
    ];

    useEffect(() => {
        setIsLoading(true)
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer); // Cleanup on unmount or activeTab change
    }, [activeTab]);

    const filteredOrders = orders.filter((order) => {
        const matchesTab = activeTab === 'all' || order.status === activeTab;
        const matchesSearch =
            search.length === 0 ||
            order.items.some((item) =>
                item.name.toLowerCase().includes(search.toLowerCase())
            );
        return matchesTab && matchesSearch;
    });


    const handleClickTab = (tab: string) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        const currentTab = tabRefs.current[activeTab];
        if (currentTab) {
            const { offsetLeft, offsetWidth } = currentTab;
            setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
        }
    }, [activeTab]);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500); // Delay để giả lập loading (tuỳ chỉnh 500ms hay 300ms cho mượt)

        return () => clearTimeout(timer);
    }, [search]);


    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    return (
        <div className="pt-2">
            <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-bold">Đơn hàng của tôi</h2>
                <div className="flex items-center w-1/2 py-4 pl-2 pr-1 rounded-full border bg-gray-200 h-10 relative">
                    <input
                        type="text"
                        className="w-full px-4 py-2 bg-transparent focus:outline-none"
                        placeholder="Tìm kiếm..."
                        value={search}
                        onChange={handleSearch}
                    />

                    {search.length > 0 && (
                        <button
                            className="absolute right-10 text-gray-50 rounded-full  transition mr-1 bg-gray-400 w-4 h-4 flex items-center justify-center"
                            onClick={() => setSearch('')}
                        >
                            ✕
                        </button>
                    )}

                    <button className="bg-blue-200 text-white px-2 py-2 rounded-full">
                        <FaMagnifyingGlass color="blue" />
                    </button>
                </div>

            </div>

            {/* Tabs */}
            <div className="relative border-b bg-white rounded-t-xl mb-2">
                <div className="flex justify-between relative">
                    {['all', 'pending', 'delivering', 'delivered', 'canceled', 'return'].map((tab) => (
                        <button
                            key={tab}
                            ref={(el) => (tabRefs.current[tab] = el)}
                            className={`px-6 py-2 transition-colors font-semibold duration-300 w-[200px] ${activeTab === tab ? 'text-blue-600 font-medium' : 'text-gray-500'}`}
                            onClick={() => handleClickTab(tab)}
                        >
                            {{
                                all: 'Tất cả',
                                pending: 'Đang xử lý',
                                delivering: 'Đang giao',
                                delivered: 'Đã giao',
                                canceled: 'Đã hủy',
                                return: 'Trả hàng',
                            }[tab]}
                        </button>
                    ))}
                </div>

                {/* Animated underline */}
                <span
                    className="absolute bottom-0 h-[2px] bg-blue-600 transition-all duration-300"
                    style={{
                        left: indicatorStyle.left,
                        width: indicatorStyle.width,
                    }}
                />
            </div>

            {/* Tab content */}
            {filteredOrders.length > 0 ? (
                <OrderCustom orders={filteredOrders} isLoading={isLoading} />
            ) : (
                <div className="flex items-center justify-center flex-col p-12">
                    <div className="w-96 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <img src="https://i.imgur.com/1T4337t.png" alt="" className="w-full" loading="lazy" />
                    </div>
                    <div className="text-gray-500">Không tìm thấy kết quả với từ khóa "{search}"</div>
                    <button className="font-semibold text-white bg-blue-600 px-16 py-2 rounded-full mt-4" onClick={() => setSearch('')}>Xóa kết quả tìm kiếm</button>
                </div>
            )}
        </div>
    );
};
