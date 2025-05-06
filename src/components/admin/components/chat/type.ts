export interface Reply {
    id: string;
    reply: string;
    createdAt: string;
    updatedAt: string;
    admin: {
        id: string;
        name: string;
        email: string;
    }
}

export interface Review {
    id: string;
    comment: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
    reply: Reply | null;
    user: {
        id: string;
        name: string;
        email: string;
        avatar_url: string;
    }
    product: {
        id: string;
        name: string;
    }
}

// Dữ liệu mẫu
export const sampleReviews: Review[] = [
    {
        id: "1",
        comment: "Sản phẩm tốt, chất lượng vải đẹp, đường may chắc chắn. Tuy nhiên size hơi nhỏ so với mô tả.",
        rating: 4,
        createdAt: "2025-05-01T10:30:00Z",
        updatedAt: "2025-05-01T10:30:00Z",
        reply: {
            id: "r1",
            reply: "Cảm ơn bạn đã đánh giá. Chúng tôi sẽ cập nhật thông tin size chính xác hơn. Rất mong được phục vụ bạn lần sau!",
            createdAt: "2025-05-01T14:20:00Z",
            updatedAt: "2025-05-01T14:20:00Z",
            admin: {
                id: "a1",
                name: "Admin Hệ thống",
                email: "admin@example.com"
            }
        },
        user: {
            id: "u1",
            name: "Nguyễn Văn A",
            email: "nguyenvana@example.com",
            avatar_url: "/api/placeholder/40/40"
        },
        product: {
            id: "p101",
            name: "Áo thun nam"
        }
    },
    {
        id: "2",
        comment: "Màu sắc không đúng như hình, vải thì khá cứng. Tôi không hài lòng lắm.",
        rating: 2,
        createdAt: "2025-05-02T09:15:00Z",
        updatedAt: "2025-05-02T09:15:00Z",
        reply: null,
        user: {
            id: "u2",
            name: "Trần Thị B",
            email: "tranthib@example.com",
            avatar_url: "/api/placeholder/40/40"
        },
        product: {
            id: "p102",
            name: "Quần jeans nữ"
        }
    },
    {
        id: "3",
        comment: "Sản phẩm tuyệt vời, đúng size, đúng màu. Sẽ ủng hộ shop lần sau!",
        rating: 5,
        createdAt: "2025-05-03T15:45:00Z",
        updatedAt: "2025-05-03T15:45:00Z",
        reply: null,
        user: {
            id: "u3",
            name: "Lê Văn C",
            email: "levanc@example.com",
            avatar_url: "/api/placeholder/40/40"
        },
        product: {
            id: "p101",
            name: "Áo thun nam"
        }
    },
    {
        id: "4",
        comment: "Giày đẹp nhưng hơi chật, phải đổi size. Dịch vụ chăm sóc khách hàng tốt.",
        rating: 3,
        createdAt: "2025-05-04T11:20:00Z",
        updatedAt: "2025-05-04T11:20:00Z",
        reply: {
            id: "r2",
            reply: "Xin lỗi vì sự bất tiện này. Chúng tôi đã ghi nhận phản hồi của bạn và sẽ cố gắng cải thiện hướng dẫn chọn size.",
            createdAt: "2025-05-04T16:30:00Z",
            updatedAt: "2025-05-04T16:30:00Z",
            admin: {
                id: "a2",
                name: "Nhân viên CSKH",
                email: "support@example.com"
            }
        },
        user: {
            id: "u4",
            name: "Phạm Thị D",
            email: "phamthid@example.com",
            avatar_url: "/api/placeholder/40/40"
        },
        product: {
            id: "p103",
            name: "Giày thể thao"
        }
    },
    {
        id: "5",
        comment: "Sản phẩm kém chất lượng, khóa kéo bị hỏng sau 1 tuần sử dụng.",
        rating: 1,
        createdAt: "2025-05-05T08:10:00Z",
        updatedAt: "2025-05-05T08:10:00Z",
        reply: null,
        user: {
            id: "u5",
            name: "Hoàng Văn E",
            email: "hoangvane@example.com",
            avatar_url: "/api/placeholder/40/40"
        },
        product: {
            id: "p104",
            name: "Túi xách nữ"
        }
    },
];