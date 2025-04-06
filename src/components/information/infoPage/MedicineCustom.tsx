import { useEffect, useState } from "react";

export const MedicineCustom = () => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000)
    }, [])

    return (
        <div>
            {isLoading ? (
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>

                    {[1, 2, 3].map((item) => (
                        <div key={item} className="mb-6">
                            <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center flex-col p-12">
                    <div className="w-96 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <img src="https://imgur.com/wJtkO6K.png" alt="" className="w-full" />
                    </div>
                    <div className="text-lg font-medium mb-1">Bạn chưa có yêu cầu nào</div>
                    <div className="text-gray-500">Dược sỹ luôn sẵn lòng lắng nghe những yêu cầu của bạn</div>
                </div>
            )}
        </div>

    )
}