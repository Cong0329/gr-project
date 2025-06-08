import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
export const MedicineCustom = () => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000)
    }, [])
    let content;
    if (isLoading) {
        content = (
            <>
                {[1, 2, 3].map((i) => (
                    <div key={i} className="mt-4 bg-white rounded-lg border animate-pulse">
                        {/* Skeleton UI */}
                        <div className="px-4 pt-4 pb-2">
                            <div className="flex justify-between items-center border-b pb-2">
                                <div className="flex items-center gap-1 font-semibold">
                                    <div className="h-5 w-36 bg-gray-200 rounded-md">
                                        <Skeleton />
                                    </div>
                                    <div className="mx-1 text-gray-300">•</div>
                                    <div className="h-5 w-32 bg-gray-200 rounded-md">
                                        <Skeleton />
                                    </div>
                                    <div className="mx-1 text-gray-300">•</div>
                                    <div className="h-5 w-20 bg-gray-200 rounded-md">
                                        <Skeleton />
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-gray-200 rounded-md mr-2"></div>
                                    <div className="h-5 w-20 bg-gray-200 rounded-md">
                                        <Skeleton />
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 pb-2 flex justify-between items-start">
                                <div className="flex items-center">
                                    <div className="h-16 w-16 bg-gray-200 rounded-md p-2">
                                        <Skeleton />
                                    </div>
                                    <div className="ml-4">
                                        <div className="h-10 w-[500px] bg-gray-200 rounded-md">
                                            <Skeleton />
                                        </div>
                                        <div className="h-5 w-32 bg-gray-200 rounded-md mt-2">
                                            <Skeleton />
                                        </div>
                                    </div>
                                </div>
                                <div className="h-5 w-20 bg-gray-200 rounded-md">
                                    <Skeleton />
                                </div>
                                <div className="h-5 w-20 bg-gray-200 rounded-md">
                                    <Skeleton />
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="h-5 w-28 bg-gray-200 rounded-md">
                                    <Skeleton />
                                </div>
                                <div className="h-5 w-36 bg-gray-200 rounded-md mt-2">
                                    <Skeleton />
                                </div>
                            </div>
                            <div className="border-t pt-2 mt-2 flex justify-end">
                                <div className="h-10 w-40 bg-gray-200 rounded-full">
                                    <Skeleton />
                                </div>
                            </div>
                        </div>
                    </div>

                ))}
            </>
        )
    } else {
        content = (
            <div className="flex items-center justify-center flex-col p-12">
                <div className="w-96 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <img src="https://imgur.com/wJtkO6K.png" alt="" className="w-full" loading="lazy" />
                </div>
                <div className="text-lg font-medium mb-1">Bạn chưa có yêu cầu nào</div>
                <div className="text-gray-500">Dược sỹ luôn sẵn lòng lắng nghe những yêu cầu của bạn</div>
            </div>
        )
    }

    return (
        <div>
            {content}
        </div>

    )
}