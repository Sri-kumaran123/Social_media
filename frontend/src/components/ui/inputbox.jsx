import { useState } from "react";

function inputBox({ type, placeholder, icon,dataCy }) {
  const [text, setText] = useState("");

  return (
    [<div className="relative w-80">
      <input
        className="w-full pl-12 pr-4 py-3 text-gray-900 bg-white/30 backdrop-blur-xl border border-white/50 rounded-xl shadow-lg outline-none placeholder-gray-500 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
        placeholder={placeholder}
        type={type}
        value={text}
        onChange={(e) => setText(e.target.value)}
        data-cy={dataCy} 
      />
      {icon && (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600">
          {icon}
        </div>
      )}
    </div>,
    text]
  );
}

export default inputBox;
