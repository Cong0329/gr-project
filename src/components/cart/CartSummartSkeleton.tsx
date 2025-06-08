import Skeleton from "react-loading-skeleton";



interface CartSummartSkeletonProps {
    isCheckout?: boolean | null;
    isDetail?: boolean | null;
}



export const CartSummartSkeleton: React.FC<CartSummartSkeletonProps> = ({ isCheckout, isDetail }) => {
    return (
        <div className={`bg-white p-4 rounded-lg animate-pulse ${isCheckout ? "mt-7" : "mt-0"}`}>
            {/* Voucher button skeleton */}
            <div className="bg-gray-200 rounded-lg w-full h-12">
                <Skeleton />
            </div>

            {/* Total amount skeleton */}
            <div className="flex justify-between mt-2">
                <div className="h-5 w-20 bg-gray-200 rounded">
                    <Skeleton />
                </div>
                <div className="h-5 w-24 bg-gray-200 rounded">
                    <Skeleton />
                </div>
            </div>

            {/* Direct discount skeleton */}
            <div className="flex justify-between mt-2">
                <div className="h-5 w-32 bg-gray-200 rounded">
                    <Skeleton />
                </div>
                <div className="h-5 w-20 bg-gray-200 rounded">
                    <Skeleton />
                </div>
            </div>

            {/* Voucher discount skeleton */}
            <div className="flex justify-between mt-2">
                <div className="flex items-center gap-1">
                    <div className="h-5 w-28 bg-gray-200 rounded">
                        <Skeleton />
                    </div>
                    <div className="rounded-full bg-gray-200 w-3.5 h-3.5">
                        <Skeleton />
                    </div>
                </div>
                <div className="h-5 w-20 bg-gray-200 rounded">
                    <Skeleton />
                </div>
            </div>

            {/* Direct discount skeleton again */}
            <div className="flex justify-between mt-2">
                <div className="h-5 w-32 bg-gray-200 rounded">
                    <Skeleton />
                </div>
                <div className="h-5 w-20 bg-gray-200 rounded">
                    <Skeleton />
                </div>
            </div>

            {/* Shipping fee skeleton - conditional */}
            {isCheckout && (
                <div className="flex justify-between mt-2">
                    <div className="h-5 w-28 bg-gray-200 rounded">
                        <Skeleton />
                    </div>
                    <div className="h-5 w-16 bg-gray-200 rounded">
                        <Skeleton />
                    </div>
                </div>
            )}

            {/* Final amount skeleton */}
            <div className="flex justify-between mt-2 pt-2 border-t border-gray-300">
                <div className="h-6 w-24 bg-gray-200 rounded">
                    <Skeleton />
                </div>
                <div className="h-6 w-28 bg-gray-200 rounded">
                    <Skeleton />
                </div>
            </div>

            {/* Payment method skeleton */}
            {isDetail && (
                <div className="mt-2 border-t pt-2">
                    <div className="h-5 w-40 bg-gray-200 rounded">
                        <Skeleton />
                    </div>
                    <div className="flex items-center mt-2 gap-2">
                        <div className="h-10 w-10 bg-gray-200 rounded-md">
                            <Skeleton />
                        </div>
                        <div className="h-5 w-56 bg-gray-200 rounded">
                            <Skeleton />
                        </div>
                    </div>
                </div>
            )}

            {/* Button skeleton */}
            <div className="w-full mt-4 h-10 bg-gray-200 rounded-full">
                <Skeleton />
            </div>
        </div>
    )
}