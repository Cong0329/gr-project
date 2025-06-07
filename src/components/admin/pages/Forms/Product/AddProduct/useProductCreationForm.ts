
import React, { useState } from "react";
import { ProductFormData, ProductImage, ProductOptionInt } from "./ProductCreationForm";
import { Title } from "../Blog/type";
import { createProduct, createProductImage, createProductOption } from "../../../../../../redux/productAsyncThunk";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../../redux/store";
export const useProductCreationForm = () => {
    const dispatch:AppDispatch = useDispatch();
    const { product_id } = useSelector((state: RootState) => state.products);
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [formData, setFormData] = useState<ProductFormData>({
        basicInfo: {
            name: '',
            code: '',
            dosage_form: '',
            specification: '',
            ingredients: '',
            registration_number: '',
            description: '',
            manufacturer: '',
            quantity: 0,
            brand_id: '',
            category_id: '',
            type: '',
            indication_id: '',
            medical_object_id: '',
        },
        images: [],
        options: [],
        detailedInfo: {
            title: '',
            description: [],
        }
    });
    const [isCompleted, setIsCompleted] = useState<boolean>(false);


    // const updateDetailedInfo = (blogTitle: string, descriptions: Title[]) => {
    //     console.log(blogTitle, descriptions)
    //     setFormData(prev => ({
    //         ...prev,
    //         detailedInfo: {
    //             ...prev.detailedInfo,
    //             title: blogTitle,
    //             description: descriptions,
    //         },
    //     }));
    // };
    const updateDetailedInfo = (blogTitle: string, descriptions: Title[]) => {
        setFormData(prev => {
            const newFormData = {
                ...prev,
                detailedInfo: {
                    ...prev.detailedInfo,
                    title: blogTitle,
                    description: descriptions,
                },
            };
            return newFormData; // Trả về formData mới
        });
    };





    // Các hàm xử lý form
    const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            basicInfo: {
                ...formData.basicInfo,
                [name]: name === "price" ? parseFloat(value) || 0 : value,
            },
        });
        console.log(formData.basicInfo)
    };

    const addImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;
        const newImages: ProductImage[] = Array.from(files).map((file) => ({
            id: `${file.name}-${Date.now()}`,
            file,
            url: URL.createObjectURL(file),
        }));
        setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...newImages],
        }));
    };

    const removeImage = (id: string) => {
        setFormData({
            ...formData,
            images: formData.images.filter((img) => img.id !== id),
        });
    };

    const addOption = () => {
        setFormData({
            ...formData,
            options: [
                ...formData.options,
                {
                    id: `opt-${Date.now()}`,
                    price: 0,
                    discounted_price: 0,
                    label: ''
                },
            ],
        });
    };

    const updateOptionField = (
        id: string,
        field: keyof Omit<ProductOptionInt, "id">,
        value: string | number
    ) => {
        setFormData({
            ...formData,
            options: formData.options.map((opt) =>
                opt.id === id ? { ...opt, [field]: value } : opt
            ),
        });
    };


    // const updateOptionName = (id: string, name: string) => {
    //     setFormData({
    //         ...formData,
    //         options: formData.options.map((opt) =>
    //             opt.id === id ? { ...opt, name } : opt
    //         ),
    //     });
    // };

    // const addOptionValue = (optionId: string, value: string) => {
    //     setFormData({
    //         ...formData,
    //         options: formData.options.map((opt) =>
    //             opt.id === optionId
    //                 ? { ...opt, values: [...opt.values, value] }
    //                 : opt
    //         ),
    //     });
    // };

    const removeOption = (id: string) => {
        setFormData({
            ...formData,
            options: formData.options.filter((opt) => opt.id !== id),
        });
    };





    // const removeOptionValue = (optionId: string, valueIndex: number) => {
    //     setFormData({
    //         ...formData,
    //         options: formData.options.map((opt) =>
    //             opt.id === optionId
    //                 ? {
    //                     ...opt,
    //                     values: opt.values.filter((_, index) => index !== valueIndex),
    //                 }
    //                 : opt
    //         ),
    //     });
    // };

    // const handleDetailedInfoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    //     setFormData({
    //         ...formData,
    //         detailedInfo: e.target.value,
    //     });
    // };

    // Kiểm tra xem bước hiện tại có đủ thông tin để tiếp tục không
    const canProceed = () => {
        switch (currentStep) {
            case 1: {
                const { name, code, dosage_form, specification, ingredients, registration_number, description, manufacturer, quantity, brand_id, category_id, type, indication_id, medical_object_id } = formData.basicInfo;
                return (
                    name.trim() !== "" &&
                    code.trim() !== "" &&
                    dosage_form.trim() !== "" &&
                    specification.trim() !== "" &&
                    ingredients.trim() !== "" &&
                    registration_number.trim() !== "" &&
                    description.trim() !== "" &&
                    manufacturer.trim() !== "" &&
                    quantity > 0 &&
                    brand_id !== null &&
                    category_id !== null &&
                    type.trim() !== "" &&
                    indication_id !== null &&
                    medical_object_id !== null
                );
            }
            case 2: {
                return formData.images.length > 0;
            }
            case 3: {
                // Kiểm tra xem tất cả các option có tên và ít nhất một giá trị
                return (
                    formData.options.length === 0 ||
                    (formData.options.length > 0 &&
                        formData.options.every(
                            (opt) => opt.label.trim() !== "" && opt.price > 0 && opt.price > opt.discounted_price
                        )
                    )
                );
            }
            case 4: {
                return (
                    formData.detailedInfo.title.trim() !== "" &&
                    formData.detailedInfo.description.length > 0
                );
            }
            default: {
                return false;
            }
        }
    };

    // Xử lý khi hoàn thành tất cả các bước
    const handleSubmit = () => {
        console.log("Sản phẩm đã được tạo:", formData);
        setIsCompleted(true);
    };

    // Xử lý tiến đến bước tiếp theo
    const nextStep = () => {
        if (currentStep === 1) {
            setCurrentStep(currentStep + 1);
            // console.log(formData.basicInfo);
            dispatch(createProduct(formData.basicInfo));
        }
        else if (currentStep === 2) {
            setCurrentStep(currentStep + 1);
            console.log(formData.images);
            dispatch(createProductImage({ productId: product_id, images: formData.images }))
        }
        else if (currentStep === 3) {
            setCurrentStep(currentStep + 1);
            console.log(formData.options);
            dispatch(createProductOption({ product_id: product_id, fullOption: formData.options }))
        }
        else if (currentStep === 4 && canProceed()) {
            handleSubmit();
        }
    };

    return {
        currentStep,
        formData,
        isCompleted,
        nextStep,
        handleBasicInfoChange,
        addImage,
        removeImage,
        addOption,
        // updateOptionName,
        // addOptionValue,
        updateOptionField,
        removeOption,
        // removeOptionValue,
        // handleDetailedInfoChange,
        canProceed,
        handleSubmit,
        updateDetailedInfo
    }
}