
function customButton({onclick,text,style, dataCy}){
    const style1 = "px-6 py-3 bg-black text-white rounded-lg shadow-lg hover:bg-gray-800 cursor-pointer"
    const style2 = "px-6 py-3 bg-white text-black border border-gray-300 rounded-lg shadow-lg hover:bg-gray-100 cursor-pointer"

    return ([
        <button
        className={style == 1? style1:style2}
        onClick={onclick}
        data-cy={dataCy}
        >
            {text}
        </button>
    ])
}

export default customButton;