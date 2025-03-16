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
        <div className="flex tb:flex-wrap gap-5  justify-around w-full">
            {child.map((child) => (
                <div className='flex tb:flex-col rounded-lg bg-white p-4 items-center w-[200px] ml:w-[100px]' key={child.title}>
                    <img src={child.image} alt={child.title} loading='lazy' className='w-1/3 h-full tb:h-[40px] object-fit' />
                    <div className='tb:hidden'>
                        <p className='font-bold pl-2 tb:text-sm'>{child.title}</p>
                    </div>
                    <div className='hidden tb:block items-center'>
                        <p className='text-center font-bold pl-2 tb:text-sm'>{child.title}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
