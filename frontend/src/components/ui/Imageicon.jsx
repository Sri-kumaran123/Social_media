function Imageicon({src, onclick}){

    console.log(src)
    return <img
    src={src}
    alt="User Profile"
    className="rounded-full md:h-[5rem] md:w-[5rem] h-[4rem] w-[4rem] border-4 border-gray-500 cursor-pointer bg-cover md:p-2 p-1"
    onClick={onclick}
    />
}

export default Imageicon;