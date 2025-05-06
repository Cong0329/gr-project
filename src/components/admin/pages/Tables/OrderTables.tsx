import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../redux/store";
import { fetchAdminOrders } from "../../../../redux/orderAsyncThunk";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { OrderTablesChild } from "./OrderTablesChild";


const OrderTables = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
    const [search, setSearch] = useState('');
    const { adminOrders, status } = useSelector((state: RootState) => state.order);
    const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchAdminOrders());
    }, [dispatch]);

    useEffect(() => {
        setIsLoading(true)
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer); // Cleanup on unmount or activeTab change
    }, [activeTab]);

    const filteredOrders = adminOrders.filter((order) => {
        const matchesTab = activeTab === 'all' || order.status === activeTab;
        const matchesSearch =
            search.length === 0 ||
            order.id.toString().toLowerCase().includes(search.toLowerCase());
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
        }, 1500); // Delay để giả lập loading (tuỳ chỉnh 500ms hay 300ms cho mượt)

        return () => clearTimeout(timer);
    }, [search]);


    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    return (
        <div className="pt-2 w-10/12">
            <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-bold">Quản lý đơn hàng</h2>
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
                    {['all', 'pending', 'confirmed', 'shipping', 'completed', 'cancelled', 'return'].map((tab) => (
                        <button
                            key={tab}
                            ref={(el) => (tabRefs.current[tab] = el)}
                            className={`px-6 py-2 transition-colors font-semibold duration-300 w-[200px] ${activeTab === tab ? 'text-blue-600 font-medium' : 'text-gray-500'}`}
                            onClick={() => handleClickTab(tab)}
                        >
                            {{
                                all: 'Tất cả',
                                pending: 'Đang xử lý',
                                shipping: 'Đang giao',
                                confirmed: 'Đã xác nhận',
                                completed: 'Đã giao',
                                cancelled: 'Đã hủy',
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
                <OrderTablesChild orders={filteredOrders} isLoading={isLoading} />
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
export default OrderTables;