import Skeleton from "react-loading-skeleton"

export const OrderSkeleton = () => {
    return (
        <div className="w-full bg-white rounded-xl mb-2 animate-pulse">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-7 w-40 bg-gray-200 rounded" />
                    <Skeleton className="h-5 w-5 bg-gray-200 rounded" />
                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-5 w-32 bg-gray-200 rounded" />
                        <Skeleton className="h-5 w-24 bg-gray-200 rounded" />
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Skeleton className="w-2 h-2 rounded-full bg-gray-200" />
                    <Skeleton className="h-5 w-16 bg-gray-200 rounded" />
                </div>
            </div>

            {/* Cancellation Message */}
            <div className="p-4 border-b">
                <Skeleton className="h-6 w-64 bg-gray-200 rounded mb-2" />
                <Skeleton className="h-5 w-72 bg-gray-200 rounded" />
            </div>

            {/* Delivery Info */}
            <div className="p-4 border-b flex items-center">
                <Skeleton className="h-8 w-8 bg-gray-200 rounded-full mr-2" />
                <Skeleton className="h-5 w-64 bg-gray-200 rounded" />
            </div>

            {/* Customer Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3">
                {/* Recipient Info */}
                <div className="p-4 border-r">
                    <div className="flex items-center mb-2">
                        <Skeleton className="h-6 w-6 bg-gray-200 rounded-full mr-2" />
                        <Skeleton className="h-5 w-32 bg-gray-200 rounded" />
                    </div>
                    <Skeleton className="h-5 w-40 bg-gray-200 rounded mb-2" />
                    <Skeleton className="h-5 w-28 bg-gray-200 rounded" />
                </div>

                {/* Delivery Location */}
                <div className="p-4 border-r">
                    <div className="flex items-center mb-2">
                        <Skeleton className="h-6 w-6 bg-gray-200 rounded-full mr-2" />
                        <Skeleton className="h-5 w-24 bg-gray-200 rounded" />
                    </div>
                    <Skeleton className="h-5 w-full bg-gray-200 rounded mb-2" />
                    <Skeleton className="h-5 w-3/4 bg-gray-200 rounded" />
                </div>

                {/* Pharmacy Info */}
                <div className="p-4">
                    <div className="flex items-center mb-2">
                        <Skeleton className="h-6 w-6 bg-gray-200 rounded-full mr-2" />
                        <Skeleton className="h-5 w-32 bg-gray-200 rounded" />
                    </div>
                    <Skeleton className="h-5 w-48 bg-gray-200 rounded mb-2" />
                    <Skeleton className="h-5 w-full bg-gray-200 rounded" />
                </div>
            </div>
        </div>
    )
}