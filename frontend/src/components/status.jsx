import { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Imageicon from "./ui/Imageicon";

function Status() {
  const scrollRef = useRef(null);

  const list = [
    { img: "https://ih1.redbubble.net/image.1512441804.1325/flat,750x,075,f-pad,750x1000,f8f8f8.jpg", name: "user1 mass" },
    { img: "https://ih1.redbubble.net/image.1512441804.1325/flat,750x,075,f-pad,750x1000,f8f8f8.jpg", name: "user6 mass" },
    { img: "https://ih1.redbubble.net/image.1512441804.1325/flat,750x,075,f-pad,750x1000,f8f8f8.jpg", name: "user16 mass" },
    { img: "https://ih1.redbubble.net/image.1512441804.1325/flat,750x,075,f-pad,750x1000,f8f8f8.jpg", name: "epic user1 mass" },
    { img: "https://ih1.redbubble.net/image.1512441804.1325/flat,750x,075,f-pad,750x1000,f8f8f8.jpg", name: "user mass hai" },
    { img: "https://ih1.redbubble.net/image.1512441804.1325/flat,750x,075,f-pad,750x1000,f8f8f8.jpg", name: "user mass hai" },
    { img: "https://ih1.redbubble.net/image.1512441804.1325/flat,750x,075,f-pad,750x1000,f8f8f8.jpg", name: "user mass hai" },
    { img: "https://ih1.redbubble.net/image.1512441804.1325/flat,750x,075,f-pad,750x1000,f8f8f8.jpg", name: "user mass hai" },
    { img: "https://ih1.redbubble.net/image.1512441804.1325/flat,750x,075,f-pad,750x1000,f8f8f8.jpg", name: "user mass hai" },
    { img: "https://ih1.redbubble.net/image.1512441804.1325/flat,750x,075,f-pad,750x1000,f8f8f8.jpg", name: "user mass hai" },
    { img: "https://ih1.redbubble.net/image.1512441804.1325/flat,750x,075,f-pad,750x1000,f8f8f8.jpg", name: "user mass hai" },
    { img: "https://ih1.redbubble.net/image.1512441804.1325/flat,750x,075,f-pad,750x1000,f8f8f8.jpg", name: "user mass hai" },
  ];

  // Scroll left
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  // Scroll right
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full flex items-center">
      {/* Left Scroll Button */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 z-10 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 hidden md:block"
      >
        <FaChevronLeft size={20} />
      </button>

      {/* Scrollable Content */}
      <div ref={scrollRef} className="w-full overflow-x-auto hide-scrollbar px-8">
        <div className="flex flex-row gap-4 min-w-max">
          {list.map((x, index) => (
            <div key={index} className="flex flex-col items-center w-[6rem]">
              <Imageicon src={x.img} />
              <p className="text-center text-sm md:text-base">{x.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Scroll Button */}
      <button
        onClick={scrollRight}
        className="absolute right-0 z-10 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 hidden md:block"
      >
        <FaChevronRight size={20} />
      </button>
    </div>
  );
}

export default Status;
