export const OrderPending = ({ status }: { status: string }) => {
    return (
        <div className="flex p-4">
            <div className="space-y-2 w-1/3">
                {/* Delivery time */}
                <div className="flex items-center">
                    <div className="flex items-center text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span className="text-sm text-gray-500 font-semibold">Dự kiến nhận hàng</span>
                    </div>
                </div>
                <div>
                    <span className="font-semibold text-lg">Từ 16:00 - 17:00 ngày 01/04/2025</span>
                </div>
                {/* Processing location */}
                <div className="text-gray-500 font-semibold text-md">
                    Đơn hàng đang được xử lý tại nhà thuốc LC GLI 1239 Quang Trung.
                </div>
            </div>
            {/* Order progress */}
            <div className="w-2/3 ml-2 overflow-hidden">
                <div className="relative">
                    {/* Progress line */}
                    <div className="absolute top-4 left-12 w-[425px]">
                        <div className="h-1 bg-gray-200">
                            <div className={`h-1 bg-green-500 ${status === 'pending' ? 'w-1/3' : 'w-2/3'}`}></div>
                        </div>
                    </div>
                    {/* Steps */}
                    <div className="relative flex justify-between">
                        <div className="text-center">
                            <div className="w-8 h-8 mx-auto rounded-full bg-green-500 flex items-center justify-center mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="text-sm font-medium">Đặt hàng</div>
                            <div className="text-xs text-gray-500">15:46, 01/04/2025</div>
                        </div>
                        <div className="text-center">
                            <div className="w-8 h-8 mx-auto rounded-full bg-green-500 flex items-center justify-center mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="text-sm font-medium">Xử lý đơn</div>
                            <div className="text-xs text-gray-500">15:46, 01/04/2025</div>
                        </div>
                        <div className="text-center">
                            {status === 'pending' ? (
                                <div className="w-8 h-8 mx-auto rounded-full bg-white border-2 border-gray-200 mb-2"></div>

                            ) : (
                                <div className="w-8 h-8 mx-auto rounded-full bg-green-500 flex items-center justify-center mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                            <div className="text-sm font-medium">Đang giao</div>
                            <div className="text-xs text-gray-500">{status === 'pending' ? '' : '17:00, 01/04/2025'}</div>
                        </div>
                        <div className="text-center">
                            <div className="w-8 h-8 mx-auto rounded-full bg-white border-2 border-gray-200 mb-2"></div>
                            <div className="text-sm font-medium">Nhận hàng</div>
                            <div className="text-xs text-gray-500"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}