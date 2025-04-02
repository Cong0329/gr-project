import { useState } from "react";
import AddressModal from "./AddressModal";

const AddressSelection = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState({
        name: "Phạm Quốc Nguyên",
        phone: "0362696258",
        address: "18/27 Nguyễn Trãi, Phường Tây Sơn, Thị Xã An Khê, Tỉnh Gia Lai",
        type: "nhà",
    });

    return (
        <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.52714 19.642C9.18736 19.5903 9.82806 19.8874 10.2011 20.4346C10.4905 20.8591 10.7647 21.2937 11.0235 21.7371C11.0931 21.8568 11.1932 21.9561 11.3172 22.0257C11.3732 22.0576 11.4326 22.0826 11.4954 22.1C11.5701 22.1208 11.6465 22.1314 11.7246 22.131C11.8672 22.131 12.0081 22.0941 12.1321 22.0245C12.2543 21.9549 12.3545 21.8551 12.4224 21.7359L12.4886 21.62C12.7276 21.2183 12.9792 20.8241 13.2432 20.4381C13.6173 19.891 14.259 19.5943 14.9197 19.6472C18.1232 19.9034 20.3847 20.5297 20.3847 21.2618C20.3847 22.2218 16.4935 23.0002 11.6924 23.0002C6.89119 23.0002 3 22.2218 3 21.2618C3 20.5252 5.29111 19.8951 8.52714 19.642Z" fill="#ACC0F3"></path><path d="M16.9616 3.04077C16.1919 2.33939 15.29 1.79873 14.3086 1.45047C13.3273 1.10222 12.2863 0.953388 11.2467 1.0127C10.207 1.07202 9.18972 1.33828 8.25435 1.79589C7.31898 2.2535 6.48438 2.89324 5.79948 3.67761C5.11458 4.46198 4.59316 5.37519 4.26579 6.3637C3.93843 7.35222 3.8117 8.39614 3.89305 9.43426C3.97439 10.4724 4.26217 11.4838 4.73951 12.4093C5.21686 13.3347 5.87415 14.1556 6.67287 14.8237C8.4989 16.3418 10.0246 18.1884 11.1712 20.268C11.2272 20.3715 11.3103 20.458 11.4115 20.5181C11.5128 20.5783 11.6284 20.6099 11.7462 20.6096C11.8638 20.6095 11.9793 20.5776 12.0803 20.5172C12.1813 20.4568 12.2641 20.3703 12.3199 20.2666L12.3733 20.1662C13.5281 18.1119 15.0507 16.2872 16.8651 14.7833C17.7059 14.0566 18.3821 13.159 18.8486 12.1504C19.3151 11.1417 19.5611 10.0451 19.5702 8.93386C19.5793 7.82258 19.3514 6.72214 18.9016 5.70593C18.4517 4.68973 17.7904 3.78114 16.9616 3.04077ZM11.7462 12.1345C11.1015 12.1345 10.4713 11.9433 9.93521 11.5852C9.39916 11.227 8.98137 10.7179 8.73465 10.1223C8.48794 9.52666 8.42339 8.87125 8.54916 8.23895C8.67493 7.60664 8.98539 7.02583 9.44125 6.56996C9.89712 6.11409 10.4779 5.80364 11.1102 5.67787C11.7425 5.55209 12.398 5.61664 12.9936 5.86336C13.5892 6.11007 14.0983 6.52787 14.4565 7.06391C14.8146 7.59996 15.0058 8.23017 15.0058 8.87487C15.0048 9.73906 14.661 10.5676 14.0499 11.1786C13.4389 11.7897 12.6104 12.1335 11.7462 12.1345Z" fill="url(#paint0_linear_3708_961710.7540146165961392)"></path><defs><linearGradient id="paint0_linear_3708_961710.7540146165961392" x1="19.5705" y1="20.6096" x2="0.435545" y2="5.28825" gradientUnits="userSpaceOnUse"><stop stop-color="#1250DC"></stop><stop offset="1" stop-color="#306DE4"></stop></linearGradient></defs></svg>
                    <p className="capitalize">{selectedAddress.type}</p>
                </div>
            <div className="flex items-center justify-between">
            
                <div>
                    <p className="text-blue-700 font-semibold">{selectedAddress.address}</p>
                    <p>{selectedAddress.name} - {selectedAddress.phone}</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="text-blue-500 hover:underline">
                    Thay đổi
                </button>
            </div>

            {isModalOpen && (
                <AddressModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSelect={setSelectedAddress}
                />
            )}
        </div>
    );
};

export default AddressSelection;
