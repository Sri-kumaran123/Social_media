

function AlertMessage({msg,res}){
    const style ="absolute top-6 right-6 w-80 px-6 py-4 text-white text-lg font-semibold rounded-lg shadow-2xl transition-opacity animate-fadeIn"
    return <div className={res?style + " bg-green-500": style + " bg-red-500"}>
    {msg}
  </div>
}

export default AlertMessage;