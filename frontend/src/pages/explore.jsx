import { useEffect, useState } from "react";
import inputBox from "../components/ui/inputbox";
import { BiSearch } from "react-icons/bi";
import { getallpost } from "../services/ui.service";
import { Posts } from "./Posts";

function Explore() {
    const [postlist, setPostlist] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);

    useEffect(() => {
        getallpost()
            .then(res => {
                setPostlist(res.data);
                setFilteredPosts(res.data); // Initialize filtered list
            });
    }, []);

    const [searchField, search] = inputBox({ type: "text", placeholder: "Search", icon: <BiSearch /> });

    // Filter posts dynamically based on post content and comments
    useEffect(() => {
        const searchLower = search.toLowerCase();

        const filtered = postlist.filter(post => {
            // Check if post content contains the search text
            const postMatches = post.content && post.content.toLowerCase().includes(searchLower);

            // Check if any comment content contains the search text
            const commentsMatch = post.comments && post.comments.some(comment => 
                comment.content && comment.content.toLowerCase().includes(searchLower)
            );

            return postMatches || commentsMatch; // Keep the post if either matches
        });

        setFilteredPosts(filtered);
    }, [search, postlist]);

    return (
        <div className="mt-4">
            <div>{searchField}</div>
            <div>
                {filteredPosts.map((x, index) => (
                    <Posts key={index} post_id={x.id} />
                ))}
            </div>
        </div>
    );
}

export default Explore;
