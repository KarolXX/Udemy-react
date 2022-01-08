import { useEffect, useState } from "react";
import { useHistory } from "react-router";

import CourseInMenu from "./CourseInMenu";

const MainPage = ({
    user, setUser,
    showLikedCourses, setShowLikedCourses,
    courses, setCourses,
    courseRedirectID, setCourseRedirectID,
    courseCategory, setCourseCategory
}) => {
    const [page, setPage] = useState(0)

    let history = useHistory()

    const params = new URLSearchParams(window.location.search)
    useEffect(() => {
        params.has('category') ?
            setCourseCategory(params.get('category'))
            :
            setCourseCategory(null)
    }, [])

    useEffect(() => {
        const url = courseCategory ? `http://localhost:8080/courses?category=${courseCategory}` : `http://localhost:8080/courses?page=${page}&size=7`
        fetch(url)
            .then(resp => resp.json())
            .then(data => setCourses(data.content))
            .catch(err => {
                console.log(err);
                alert('Server Error')
            })
    }, [courseCategory, page])

    console.log('RENDER mainpage')

    return (
        <div className="dark-spectrum-bg">
            <div className="menu" style={showLikedCourses ? { "backgroundColor": "#ac4993" } : null}>
                {showLikedCourses && <h1 style={{ "margin": "0 30%", "color": "arial" }}>Favourite courses</h1>}
                {
                    courses ?
                        courses.map(course => <CourseInMenu
                            setCourseRedirectID={setCourseRedirectID}
                            course={course}
                            setShowLikedCourses={setShowLikedCourses}
                            setCourseCategory={setCourseCategory}
                        />)
                        :
                        null
                }
                <button onClick={() => setPage((prevState) => prevState + 1)}>===q</button>
            </div>
        </div>
    )
}

export default MainPage;