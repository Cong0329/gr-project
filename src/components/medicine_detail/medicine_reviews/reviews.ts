
export interface Review {
        id: number;
        name: string;
        rating: number;
        comment: string;
        time: string;
        reply?: {
            name: string;
            role: string;
            comment: string;
            time: string;
        };
    }

export const reviews = [
    {
      id: 1,
      name: "An Lưu",
      rating: 4,
      comment: "Ổn",
      time: "15 ngày trước",
      reply: {
        name: "Vĩ Trần",
        role: "Dược Sĩ",
        comment:
          "Chào anh An Lưu, \nDạ rất cảm ơn tình cảm của anh dành cho nhà thuốc FPT Long Châu...",
        time: "15 ngày trước",
      },
    },
    {
      id: 2,
      name: "Hào Bắc",
      rating: 5,
      comment: "Đây là men tiêu hoá hay men vi sinh",
      time: "29 ngày trước",
      reply: {
        name: "Huỳnh Thị Mai Phương",
        role: "Dược Sĩ",
        comment:
          "Chào bạn Hào Bắc,\nDạ sản phẩm là hỗn dịch uống men vi sinh ạ...",
        time: "29 ngày trước",
      },
    },
    {
      id: 3,
      name: "Chị Hương",
      rating: 5,
      comment: "",
      time: "10 ngày trước",
    },
  ];