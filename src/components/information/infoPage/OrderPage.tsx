import { useEffect, useRef, useState } from 'react';
import {MedicineCustom} from './MedicineCustom';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { OrderCustom } from './OrderCustom';

export const OrderPage = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

    const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

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

    return (
        <div className="pt-2">
            <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-bold">Đơn hàng của tôi</h2>
                <div className="flex items-center w-1/2 py-4 pl-2 pr-1 rounded-full border bg-gray-200 h-10">
                    <input
                        type="text"
                        className="w-full px-4 py-2 bg-transparent focus:outline-none "
                        placeholder="Tìm theo tên đơn, mã đơn, hoặc tên sản phẩm..."
                    />
                    <button className="bg-blue-200 text-white px-2 py-2  rounded-full">
                        <FaMagnifyingGlass color='blue' />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="relative border-b  bg-white rounded-t-xl mb-2">
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
            {activeTab === 'all' && (
                <OrderCustom orders={[1, 2]} />
            )}
            {activeTab === 'pending' && <OrderCustom orders={[]} />}
            {activeTab === 'delivering' && <OrderCustom orders={[]} />}
            {activeTab === 'delivered' && <OrderCustom orders={[]} />}
            {activeTab === 'canceled' && <OrderCustom orders={[1, 2]} />}
            {activeTab === 'return' && <OrderCustom orders={[]} />}
        </div>
    );
};
