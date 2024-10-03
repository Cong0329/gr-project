import { Slide } from "./carousel/Slide";
import { Slides } from "./carousel/Slides";
import { BannerChild } from "./BannerChild";

export const Banner = () => {
  return (
    <div className="w-4/5 m-auto  pt-3">
      <div className="">
        <div className="w-full flex justify-center items-center h-[245px]">
          <Slide />
          <Slides />
        </div>
        <div className="w-full mt-5">
          <BannerChild />
        </div>
      </div>
    </div>
  )
}
