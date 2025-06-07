import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";

export default function EcommerceMetrics({
  totalUsers,
  latestUserGrowth,
  totalOrders,
  latestOrderGrowth,
  totalRevenue
}: {
  totalUsers: number;
  latestUserGrowth: number | null;
  totalOrders: number;
  latestOrderGrowth: number | null;
  totalRevenue: number;
}) {
  console.log(latestOrderGrowth);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5  md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl ">
          <GroupIcon className="text-gray-800 size-6 " />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 ">
              Khách hàng
            </span>
            <h4 className="mt-2 font-bold text-2xl text-gray-800 text-title-sm ">
              {totalUsers}
            </h4>
          </div>
          {(latestUserGrowth !== null && latestUserGrowth > 0) ? (
            <Badge color="success">
              <ArrowUpIcon />
              {latestUserGrowth}%
            </Badge>
          ) : (
            latestUserGrowth !== null &&
            <Badge color="error">
              <ArrowDownIcon />
              {latestUserGrowth}%
            </Badge>
          )}
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
        <div className="flex gap-2">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl ">
            <BoxIconLine className="text-gray-800 size-6 " />
          </div>
          <h4 className="mt-2 font-bold text-2xl text-gray-800 text-title-sm ">
            {totalOrders}
          </h4>
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 ">
              Doanh thu
            </span>
            <h4 className="mt-2 font-bold text-2xl text-gray-800 text-title-sm ">
            {totalRevenue.toLocaleString()} VND
            </h4>
          </div>

          {(latestOrderGrowth !== null && latestOrderGrowth > 0) ? (
            <Badge color="success">
              <ArrowUpIcon />
              {latestOrderGrowth}%
            </Badge>
          ) : (
            latestOrderGrowth !== null &&
            latestOrderGrowth < 0 &&
            <Badge color="error">
              <ArrowDownIcon />
              {latestOrderGrowth}%
            </Badge>
          )}
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
}
