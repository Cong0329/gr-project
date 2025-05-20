// interfaces.ts
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
    };
    product: {
        id: string;
        name: string;
    };
}

export interface Reply {
    id: string;
    reply: string;
    createdAt: string;
    updatedAt: string;
    admin: {
        id: string;
        name: string;
        email: string;
    };
}