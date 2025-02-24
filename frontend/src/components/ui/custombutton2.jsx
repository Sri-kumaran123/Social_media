
function customButton2({onclike,text}){

    return <button
    className="relative px-6 py-3 text-black bg-white border overflow-hidden border-gray-300 rounded-lg shadow-lg  transition-all duration-500 group cursor-pointer"
    onClike={onclike}
    >
        
        <span className="relative z-10 transition-all duration-500 group-hover:text-white">{text}</span>
        
        {/* Animated Background Overlay */}
        <div className="absolute inset-0  bg-black scale-0 group-hover:scale-100 transition-transform duration-500 origin-bottom-right"></div>
        
    </button>

}

export default customButton2;