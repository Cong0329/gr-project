import { useEffect, useRef, useState } from 'react';
import {MedicineCustom} from './MedicineCustom';

export const MedicinePage = () => {
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
        <div className="p-6">
            <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-bold">Đơn thuốc của tôi</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Gửi yêu cầu mới</button>
            </div>

            {/* Tabs */}
            <div className="relative border-b  bg-white rounded-t-xl mb-2">
                <div className="flex justify-between relative">
                    {['all', 'pending', 'consulted', 'uncontactable'].map((tab) => (
                        <button
                            key={tab}
                            ref={(el) => (tabRefs.current[tab] = el)}
                            className={`px-6 py-2 transition-colors duration-300 w-[200px] ${activeTab === tab ? 'text-blue-600 font-medium' : 'text-gray-500'}`}
                            onClick={() => handleClickTab(tab)}
                        >
                            {{
                                all: 'Tất cả',
                                pending: 'Chờ tư vấn',
                                consulted: 'Đã tư vấn',
                                uncontactable: 'Chưa thể liên lạc',
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
                <MedicineCustom />
            )}
            {activeTab === 'pending' && <MedicineCustom />}
            {activeTab === 'consulted' && <MedicineCustom />}
            {activeTab === 'uncontactable' && <MedicineCustom />}
        </div>
    );
};
