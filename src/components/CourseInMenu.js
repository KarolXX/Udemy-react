import { React, useState, useRef, useEffect } from "react";

import { useHistory } from "react-router";

import { FaRegStar, FaStar } from "react-icons/fa";
import { IconContext } from "react-icons";

const CourseInMenu = ({
  course,
  setCourseRedirectID,
  setShowLikedCourses,
  setCourseCategory,
}) => {
  const [lock, setLock] = useState(false);
  const stars = useRef();
  let history = useHistory();

  useEffect(() => {
    setShowLikedCourses(false);
    setLock(true);
  }, []);

  //FIXME
  const getStars = (rate) => {
    if (rate === 0) {
      return "No ratings yet";
    } else if (rate <= 1) {
      return (
        <IconContext.Provider value={{ color: "yellow" }}>
          <FaStar />
          <FaRegStar />
          <FaRegStar />
          <FaRegStar />
          <FaRegStar />
        </IconContext.Provider>
      );
    } else if (rate <= 2) {
      return (
        <IconContext.Provider value={{ color: "yellow" }}>
          <FaStar />
          <FaStar />
          <FaRegStar />
          <FaRegStar />
          <FaRegStar />
        </IconContext.Provider>
      );
    } else if (rate <= 3) {
      return (
        <IconContext.Provider value={{ color: "yellow" }}>
          <FaStar />
          <FaStar />
          <FaStar />
          <FaRegStar />
          <FaRegStar />
        </IconContext.Provider>
      );
    } else if (rate <= 4) {
      return (
        <IconContext.Provider value={{ color: "yellow" }}>
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
          <FaRegStar />
        </IconContext.Provider>
      );
    } else if (rate <= 5) {
      return (
        <IconContext.Provider value={{ color: "yellow" }}>
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
        </IconContext.Provider>
      );
    }
  };

  const redirect = () => {
    history.push(`/courses/${course.id}`);
    setCourseCategory(null);
    setCourseRedirectID(course.id);
  };

  return (
    <>
      <div className="menu__course" onClick={redirect}>
        <img
          className="menu__image"
          alt="noo"
          src={
            course.image
              ? `http://${process.env.REACT_APP_URL}:8080/courses/${course.id}/img`
              : "/assets/react_js.jpg"
          }
          width="290px"
          height="160px"
        />
        <div className="menu__course-description">
          <h1 style={{ margin: "0px" }}>{course.title}</h1>
          <div className="menu__course-price">
            <i>
              {course.promotion ? (
                <>
                  {course.promotion}$<br></br>
                  <strike style={{ fontSize: "20px", color: "yellow" }}>
                    {course.price}$
                  </strike>
                </>
              ) : (
                course.price + "$"
              )}
            </i>
          </div>
          <h2 ref={stars}>
            {lock && getStars(course.averageRating)}{" "}
            {"(" + course.averageRating + " / 5)"}
          </h2>
          <p>
            {course.usersNumber !== 0
              ? course.usersNumber + " users bought this course"
              : "Nobody bought this course so far"}
          </p>
        </div>
      </div>
      <hr style={{ width: "90%", color: "aqual" }}></hr>
    </>
  );
};

export default CourseInMenu;
