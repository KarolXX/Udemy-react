import { FaUserAlt } from 'react-icons/fa'

const Comment = ({ comment }) => {
    return (
        <div className="comment">
            <hr></hr>
            <h2><FaUserAlt style={{ "marginRight": "10px" }} />{comment.user.name}</h2>
            <h3>{comment.text}</h3>
        </div>
    )
}

export default Comment