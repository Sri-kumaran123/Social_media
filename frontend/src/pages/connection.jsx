import { useEffect, useState } from "react";
import { followuser, getalluser, getfollowinguser, unfollowuser } from "../services/ui.service";
import customButton2 from "../components/ui/custombutton2";
import { useSelector } from "react-redux";

function Connection() {
    const currentuser = useSelector(state => state.User);
    const [data, setdata] = useState([]);
    const [following, setfollowing] = useState([]);
    const [change, setchange] = useState(false);

    useEffect(() => {
        getalluser()
            .then(res => {
                setdata(res.data);
            });
        getfollowinguser(currentuser.id)
            .then(res => setfollowing(res.data));
    }, [change]);

    const handlefollow = (id) => {
        followuser(id)
            .then(res => setchange(prev => !prev));
    };

    const handleunfollow = (id) => {
        unfollowuser(id)
            .then(res => setchange(prev => !prev));
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {data.map((x, index) => (
                <div key={index} className="bg-gray-800 text-white p-4 rounded-md flex flex-col items-center shadow-md">
                    <h2 className="text-lg font-semibold">{x.username}</h2>
                    {following?.following?.some(num => num.id === x.id) ? (
                        <button 
                            onClick={() => handleunfollow(x.id)} 
                            className="mt-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-900">
                            Unfollow
                        </button>
                    ) : (
                        <button 
                            onClick={() => handlefollow(x.id)} 
                            className="mt-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-900">
                            Follow
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Connection;
