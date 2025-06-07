import "./GeneralEx.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import {
  fetchServicePackages,
  selectFeaturedPackages,
  selectSuggestedPackages,
  selectAllPackages,
  selectLoadingStatus,
} from "../../../redux/servicePackageSlice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const PackageCard = ({
  pkg,
  isSlider = false,
}: {
  pkg: any;
  isSlider?: boolean;
}) => {
  if (isSlider) {
    return (
      <div className="w-full h-48 bg-indigo-50 flex flex-col items-center justify-center rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4">
        <img
          src={pkg.image}
          className="w-20 h-20 rounded-full object-cover mb-2"
          alt={pkg.name}
        />
        <div className="text-base font-semibold text-center mb-2 line-clamp-2 package-slide">
          {pkg.name}
        </div>
        <div className="flex items-center">
          <FaStar className="text-yellow-400 mr-1" />
          <span className="text-sm text-gray-600">
            {pkg.rating?.toFixed(1) || "N/A"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <Link
      to={`/booking-home/generalex-detail/${encodeURIComponent(pkg.name)}`}
      className="block h-full"
    >
      <div className="bg-indigo-50 rounded-lg shadow-md overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
        <img
          src={pkg.image}
          alt={pkg.name}
          className="w-full h-32 object-cover"
        />
        <div className="p-4 flex flex-col flex-grow general-category">
          <div className="flex justify-between items-start">
            <span className="text-lg font-bold text-gray-800 hover:text-blue-500 line-clamp-2">
              {pkg.name}
            </span>
            {pkg.rating && (
              <span className="flex items-center text-sm px-2 py-1 rounded ml-2 flex-shrink-0">
                <FaStar className="text-yellow-400 mr-1" />
                {pkg.rating.toFixed(1)}
              </span>
            )}
          </div>
          <div className="flex justify-between items-center mt-auto pt-2">
            <span className="text-sm font-semibold text-gray-500">Giá:</span>
            <span className="text-base font-semibold text-gray-800">
              {pkg.price?.toLocaleString("vi-VN")}đ
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const SliderSection = ({
  title,
  packages,
  loading,
}: {
  title: string;
  packages: any[];
  loading: boolean;
}) => {
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "15%",
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          centerPadding: "5%",
        },
      },
    ],
  };

  return (
    <>
      <div className="mb-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <div className="h-1 w-12 bg-indigo-500 rounded mt-2 mb-4"></div>
      </div>
      <div className="relative my-6">
        {loading ? (
          <div className="flex justify-center">
            <Skeleton circle width={80} height={80} className="mr-4" />
            <Skeleton circle width={80} height={80} className="mr-4" />
            <Skeleton circle width={80} height={80} />
          </div>
        ) : (
          <Slider {...sliderSettings}>
            {packages.map((pkg, index) => (
              <div key={index} className="px-2">
                <Link
                  to={`/booking-home/generalex-detail/${encodeURIComponent(
                    pkg.name
                  )}`}
                >
                  <PackageCard pkg={pkg} isSlider />
                </Link>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </>
  );
};

const GeneralEx = () => {
  const dispatch = useDispatch<AppDispatch>();
  const featuredPackages = useSelector(selectFeaturedPackages);
  const suggestedPackages = useSelector(selectSuggestedPackages);
  const allPackages = useSelector(selectAllPackages);
  const loading = useSelector(selectLoadingStatus);

  useEffect(() => {
    if (allPackages.length === 0) {
      dispatch(fetchServicePackages());
    }
  }, [dispatch, allPackages.length]);

  return (
    <div id="general-ex-section" className="general-ex w-full">
      <div className="container-lite mx-auto px-4 py-8">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/3 px-4 mb-4 md:mb-0">
            <div className="bg-white rounded-lg shadow-md p-4 h-full text-xl lg:text-2xl font-bold text-indigo-600 ">
              <SliderSection
                title="Gói nổi bật"
                packages={featuredPackages}
                loading={loading}
              />
              <div className="mt-12 ml:hidden">
                <SliderSection
                  title="Gói đề xuất"
                  packages={suggestedPackages}
                  loading={loading}
                />
              </div>
            </div>
          </div>

          <div className="w-full md:w-2/3 px-4">
            <div className="bg-white rounded-lg shadow-md p-4 h-full">
              <div className="flex mb-4 justify-between items-center general-title">
                <div className="flex flex-col">
                  <h2 className="text-xl lg:text-2xl font-bold text-indigo-600 mb-2">
                    Danh mục
                  </h2>
                  <div className="h-1 w-20 bg-indigo-500 rounded"></div>
                </div>
                <Link to="/booking-home/generalex-list">
                  <button className="bg-indigo-100 hover:bg-indigo-200 text-indigo-500 font-semibold py-2 px-4 rounded-full transition duration-300 flex items-center">
                    Xem thêm
                    <span className="ml-1">&gt;</span>
                  </button>
                </Link>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                      <Skeleton height={128} className="w-full" />
                      <div className="p-4">
                        <Skeleton count={2} />
                        <Skeleton width={100} className="mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {allPackages.slice(0, 6).map((pkg: any, index: number) => (
                    <PackageCard key={index} pkg={pkg} />
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="w-full md:w-1/3 px-4 mb-6 md:mb-0 mt-4 hidden ml:block">
            <div className="bg-white rounded-lg shadow-md p-4 h-full">
              <div className="">
                <SliderSection
                  title="Gói đề xuất"
                  packages={suggestedPackages}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralEx;
