import { FaUserAlt } from "react-icons/fa";

const Comment = ({ comment, courseId }) => {
  console.log("comment render");
  return (
    <div className="comment">
      <hr></hr>
      <h2>
        <FaUserAlt style={{ marginRight: "10px" }} />
        {comment.user.name}
      </h2>
      <h3>{comment.text}</h3>
      {comment.image && (
        <img
          className="comment__image"
          src={
            comment.image.filePath
              ? `http://localhost:8080/courses/${courseId}/comments/${comment.commentId}/img`
              : null
          }
          alt="noooo"
        />
      )}
    </div>
  );
};

export default Comment;
