
function Navbar(){
    return <nav
    className="flex flex-row md:px-7 "
    >
        <div
        className="flex flex-row items-center "
        >
            <img 
            src="/logo.png" 
            alt="logo " 
            className="h-[5rem] w-[5rem]"
            />
            <h1
            className="md:text-3xl text-2xl font-semibold drop-shadow-md"
            >Connect Hub</h1>
        </div>
    </nav>
}

export default Navbar;