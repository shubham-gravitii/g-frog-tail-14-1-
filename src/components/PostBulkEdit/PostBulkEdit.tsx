import { useState } from 'react';
import GalleryComponentViewOwnPost from '../Board/RecordCardOwnerViewOwnPost';
import { Col } from "reactstrap";
const PostBulkEdit = ({ post, onDelete }) => {
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    return (


        <Col xs="12" sm="6" md="4" lg="3" className="p-3">
            <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
            />
            {/* <GalleryComponentViewOwnPost details={post}  specification_Details={"hello"} /> */}
        </Col>


    );
};

export default PostBulkEdit;
// In your parent component, use the PostItem component for each post
// data?.slice(1, 10).map((e, i) => (
//   <PostItem key={i} post={e} onDelete={handleDelete} />
// ));

        // <Col xs="12" sm="6" md="4" lg="3" className="p-3">
        //     <input
        //         type="checkbox"
        //         checked={isChecked}
        //         onChange={handleCheckboxChange}
        //     />
        //     <GalleryComponentViewOwnPost details={post} rental_Details={""} specification_Details={"hello"} />
        //     {/* <button onClick={() => onDelete(post.id)} disabled={!isChecked}>
        //         Delete
        //     </button> */}
        // </Col>