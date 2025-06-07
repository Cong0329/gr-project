
export enum DescriptionType {
    PRODUCT_DESCRIPTION = "Product Description",
    INGREDIENTS = "Ingredients",
    BENEFITS = "Benefits",
    USAGE = "Usage",
    SIDE_EFFECTS = "Side Effects",
    WARNINGS = "Warnings",
    STORAGE = "Storage"
}

export interface Description {
    title: string;
    description: Title[];
    image: string;
}

export interface TitleBase {
    type: DescriptionType;
    title: string | null;
    image: string | null;
}

export interface TextTitle extends TitleBase {
    type: DescriptionType; // Chỉ sử dụng các giá trị từ enum
    description: string;
}

export interface IngredientTitle extends TitleBase {
    type: DescriptionType.INGREDIENTS; // Chỉ sử dụng type Ingredients
    descriptions: Ingredient[] | null;
    ingredients: Instruction[] | null;
}

export interface Ingredient {
    id: string;
    section_id: string;
    text: string;
}

export interface Instruction {
    id: string;
    section_id: string;
    name: string;
    value: string;
}

export type Title = TextTitle | IngredientTitle;

// export const productDescription: Description = {
//     title: "Hỗn dịch uống Enterogermina Gut Defense",
//     image: "https://example.com/product-image.jpg",
//     description: [
//         {
//             type: DescriptionType.PRODUCT_DESCRIPTION,
//             title: "Mô tả sản phẩm",
//             image: "https://i.imgur.com/QtNWVcK.png",
//             description: "Tại Việt Nam, ngày càng nhiều trẻ nhỏ gặp vấn đề về tiêu hóa, với tỷ lệ mắc bệnh lên tới 40%. Trong giai đoạn đầu đời, hệ tiêu hóa của trẻ rất nhạy cảm và dễ bị tác động bởi nhiều yếu tố, như chế độ ăn uống không hợp lý và sự thay đổi trong môi trường sống. Mặc dù các bậc phụ huynh luôn cố gắng chăm sóc dinh dưỡng cho con, tình trạng rối loạn tiêu hóa như tiêu chảy, táo bón hay đầy hơi vẫn có thể xảy ra. Nguyên nhân chủ yếu là do thiếu hụt lợi khuẩn cần thiết cho sự cân bằng vi sinh trong đường ruột của trẻ. Hệ vi sinh Đường ruột của chúng ta là nơi cư trú của hàng triệu vi khuẩn, trong đó có cả lợi khuẩn và hại khuẩn./nSự cân bằng giữa hai loại vi khuẩn này đóng vai trò quan trọng trong việc duy trì sức khỏe tiêu hóa và tăng cường hệ miễn dịch. Khi hại khuẩn vượt trội, bạn có thể đối mặt với những triệu chứng khó chịu như đầy bụng, khó tiêu, hay tiêu chảy, ảnh hưởng đến khả năng hấp thu dinh dưỡng và sự phát triển toàn diện. Những yếu tố như chế độ ăn uống không hợp lý, môi trường ô nhiễm, và áp lực từ cuộc sống hàng ngày có thể làm mất cân bằng hệ vi sinh đường ruột, gây ra những rối loạn tiêu hóa khó chịu. Để giúp bạn duy trì hệ tiêu hóa khỏe mạnh, việc bổ sung lợi khuẩn là cần thiết, giúp tái lập cân bằng vi sinh và bảo vệ đường ruột khỏi sự xâm nhập của hại khuẩn."
//         },
//         {
//             type: DescriptionType.INGREDIENTS,
//             title: "Thành phần",
//             image: null,
//             description: {
//                 description: [
//                     "Pancreatin: Có tác dụng tăng cường phân giải chất béo, protein, giúp tăng cường hệ miễn dịch.",
//                     "Papain: Giúp tiêu hoá các loại protein trong thức ăn và phòng ngừa rối loạn tiêu hoá.",
//                     "Bromelain: Giúp tăng cường hệ miễn dịch, phòng ngừa rối loạn tiêu hoá và tăng cường tiêu hoá chất đạm."
//                 ],
//                 ingredients: [
//                     { name: "Bacillus Clausii", value: "2x10^9 CFU" },
//                     { name: "Nước tinh khiết", value: "Vừa đủ" }
//                 ]
//             }
//         },
//         {
//             type: DescriptionType.BENEFITS,
//             title: "Công dụng",
//             image: null,
//             description: "Hỗ trợ hệ tiêu hóa, giúp cân bằng hệ vi sinh đường ruột, cải thiện tình trạng tiêu chảy và táo bón."
//         },
//         {
//             type: DescriptionType.USAGE,
//             title: "Cách dùng",
//             image: null,
//             description: "Trẻ em từ 1-12 tuổi: 1-2 ống mỗi ngày. Người lớn: 2-3 ống mỗi ngày, dùng trực tiếp hoặc pha với nước."
//         },
//         {
//             type: DescriptionType.SIDE_EFFECTS,
//             title: "Tác dụng phụ",
//             image: null,
//             description: "Hầu như không có tác dụng phụ, nhưng có thể gây đầy bụng nhẹ ở một số người."
//         },
//         {
//             type: DescriptionType.WARNINGS,
//             title: "Lưu ý",
//             image: null,
//             description: "Không sử dụng cho người mẫn cảm/kiêng kỵ với bất kỳ thành phần nào của sản phẩm./nNgười đang sử dụng thuốc, phụ nữ có thai hoặc đang cho con bú cần tham khảo ý kiến chuyên gia y tế trước khi sử dụng./nChỉ được uống, không được tiêm./nKhông dùng quá liều khuyến cáo./nSản phẩm này không phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh.Đọc kỹ hướng dẫn sử dụng trước khi dùng."
//         },
//         {
//             type: DescriptionType.STORAGE,
//             title: "Bảo quản",
//             image: null,
//             description: "Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp."
//         },

//     ]
// };
