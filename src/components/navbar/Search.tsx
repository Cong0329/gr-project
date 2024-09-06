

export const Search = () => {
    return (
        <div className="relative w-full  mx-auto bg-white rounded-full">
            <input placeholder="Tìm tên thuốc, bệnh lý, thực phẩm chức năng..." className="text-black rounded-full w-full h-full bg-transparent py-2 pl-5 pr-32 outline-none border-2 border-gray-100 shadow-md hover:outline-none" type="text" name="query" id="query" />
            <button type="submit" className="text-blue-800 focus:text-white absolute right-0 top-0 h-10 w-10 bg-blue-200 rounded-full mr-1 my-1 flex items-center justify-center focus:bg-blue-700">
                <svg className="w-5 h-5 " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
            </button>
        </div>
    )
}
