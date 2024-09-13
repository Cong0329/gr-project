import mua from '../../../assets/banner/canmuathuoc_29bf521996.png';
import duocsy from '../../../assets/banner/tuvanvoiduocsi_1855320b40.png';
import nhathuoc from '../../../assets/banner/timnhathuoc_cbadb52c85.png';
import don from '../../../assets/banner/doncuatoi_5058ac6058.png';
import vacxin from '../../../assets/banner/vaccine_013e37b079.png';
import kiemtra from '../../../assets/banner/kiemtrasuckhoe_15f6ff48e9.png';




interface BannerChildProps {
    title: string;
    image: string;
}


const child: BannerChildProps[] = [
    {
        title: "Cần mua thuốc",
        image: mua
    },
    {
        title: "Tư vấn Dược Sỹ",
        image: duocsy
    },
    {
        title: "Tìm nhà thuốc",
        image: nhathuoc
    },
    {
        title: "Đơn của tôi",
        image: don
    },
    {
        title: "Tiêm Vắc xin",
        image: vacxin
    },
    {
        title: "Kiểm tra sức khỏe",
        image: kiemtra
    },

]

export const BannerChild = () => {
  return (
    <div className="flex justify-between">
        {child.map((child) => (
            <div className='flex rounded-lg bg-white p-4 items-center' key={child.title}>
                <img src={child.image} alt={child.title} className='w-1/3 h-full'/>
                <div>
                    <p className='font-bold pl-2'>{child.title}</p>
                </div>
            </div>
        ))}
    </div>
  )
}
