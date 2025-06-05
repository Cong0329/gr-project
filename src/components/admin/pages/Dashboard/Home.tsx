import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import PageMeta from "../../components/common/PageMeta";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import { useEffect } from "react";
import { fetchMonthlyTarget, fetchOrderRevenue, fetchTarget, fetchUserRevenue } from "../../../../redux/revenueAsyncThunk";

export default function Home() {
  const { userRevenue, orderRevenue, target, monthlyTarget } = useSelector((state: RootState) => state.revenue);
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserRevenue());
    dispatch(fetchOrderRevenue());
    const date = new Date();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const day = date.getDate().toString().padStart(2, "0");
    dispatch(fetchTarget(`${year}-${month}-${day}`));
    dispatch(fetchMonthlyTarget(`${year}-${month}`));
  }, [dispatch]);
  const validEntries = userRevenue.filter(
    (entry) => entry.month !== '0000-00' && entry.growth !== null
  );

  // Sắp xếp theo tháng giảm dần
  validEntries.sort((a, b) => b.month.localeCompare(a.month));
  const validOrderEntries = orderRevenue.filter(
    (entry) => entry.month !== '0000-00' && entry.revenue_growth !== null
  );

  // Sắp xếp theo tháng giảm dần
  validOrderEntries.sort((a, b) => b.month.localeCompare(a.month));

  // Lấy growth mới nhất
  const latestUserGrowth = validEntries[0]?.growth ?? null;
  const latestOrderGrowth = validOrderEntries[1]?.revenue_growth ?? 0;
  const totalUsers = userRevenue.reduce((sum, entry) => sum + entry.user_count, 0);
  const totalOrders = orderRevenue.reduce((sum, entry) => sum + entry.order_count, 0);
  const totalRevenue = orderRevenue.reduce((sum, entry) => sum + entry.total_revenue, 0);
  const monthlyRevenue = Array(12).fill(0);

  orderRevenue.forEach(entry => {
    const monthIndex = parseInt(entry.month.split('-')[1], 10) - 1;
    monthlyRevenue[monthIndex] = entry.total_revenue;
  });
  return (
    <>
      <PageMeta
        title=""
        description=""
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics
            totalUsers={totalUsers}
            latestUserGrowth={latestUserGrowth}
            latestOrderGrowth={latestOrderGrowth}
            totalOrders={totalOrders}
            totalRevenue={totalRevenue}
          />

          <MonthlySalesChart monthlyRevenue={monthlyRevenue}/>
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget latestOrderGrowth={latestOrderGrowth} target={target} monthlyTarget={monthlyTarget}/>
        </div>

        {/* <div className="col-span-12">
          <StatisticsChart />
        </div> */}
      </div>
    </>
  );
}
