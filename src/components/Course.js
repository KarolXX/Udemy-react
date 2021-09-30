import { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router';
import { useForm } from 'react-hook-form';

import { FaStar, FaRegStar } from 'react-icons/fa';

import Comment from './Comment';
import CourseInMenu from './CourseInMenu';


const Course = ({ id, setID, user, courseCategory, setCourseCategory, setShowLikedCourses }) => {

    const [courseModel, setCourseModel] = useState(null)
    const [otherCourses, setOtherCourses] = useState(null)
    const [err, setErr] = useState(null)
    const [isLiked, setIsLiked] = useState(null)
    const [isBought, setIsBought] = useState(false)
    const [userRate, setUserRate] = useState(null)
    // state that is displayed as a hint for user to let him know what rate he can accept by click on star
    const [userVote, setUserVote] = useState(null)
    const [selectedFile, setSelectedFile] = useState()

    const commentForm = useRef()
    let history = useHistory()

    //console.log('course re-render')

    useEffect(() => {
        return () => {
            console.log('course unmount')

            setOtherCourses(null)
            setErr(false)
            setIsLiked(null)
            setIsBought(false)
            setUserRate(null)
            setUserVote(null)
        };
    }, [id])

    // useEffect(() => {
    //     setOtherCourses(null)
    //     setErr(false)
    //     setIsLiked(null)
    //     setIsBought(false)
    //     setUserRate(null)
    //     setUserVote(null)
    // }, [id]) //when id changes (another course is displayed) then 'clean' state
    //that's a bad mindset because when id changes it means that 
    //component received new id prop ... and every another prop as well - OK but then state is still the same 
    //so it's not a bad mindset!!! (anyway it's done in first useEffect)

    useEffect(() => {
        console.log('course effect')
        fetch(`http://localhost:8080/courses/${id}?user=${user.userId}`)
            .then(resp => resp.json())
            .then(data => setCourseModel(data))
            .catch(err => setErr(true));
    }, [userRate, id, user, isLiked]) // fetch courseModel again after changing user rate to update average rate

    const getCategory = (categoryID) => {
        console.log('ss')
        setID(null)
        setCourseCategory(categoryID)
    }

    const getStars = (rate, isVotable) => {
        const faStars = Array.from({ length: rate },
            (_, index) => <FaStar
                key={'star' + index}
                color="gold"
                onMouseOver={() => isVotable && setUserVote(index + 1)}
                onMouseOut={() => isVotable && setUserVote(null)}
                onClick={() => isVotable && sendRate(index + 1)}
            />
        )
        const faRegStars = Array.from({ length: 5 - faStars.length },
            (_, index) => <FaRegStar
                key={'regStar' + index}
                color="gold"
                onMouseOver={() => isVotable && setUserVote(faStars.length + index + 1)}
                onMouseOut={() => isVotable && setUserVote(null)}
                onClick={() => isVotable && sendRate(faStars.length + index + 1)}
            />
        )
        return <>{faStars}{faRegStars}</>
    }

    const sendRate = (rate) => {
        fetch(`http://localhost:8080/courses/course-rating`, {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: {
                    courseId: id,
                    userId: user.userId
                },
                rating: rate
            })
        })
            .then(resp => resp.json())
            .then(data => setUserRate(data))
            .catch(err => alert(err))
    }

    const handleUserRate = () => {
        const set = () => {
            setIsBought(true)
            setUserRate(courseModel.userRate)
        }
        courseModel.boughtCourse && set()

        // if (user && course) {
        //     for (let i = 0; i < course.userIDs.length; i++) {
        //         if (user.userId === course.userIDs[i]) {
        //             for (let k = 0; k < course.course.ratings.length; k++) {
        //                 console.log("courseAndUserIDs.course.ratings[k].userId: " + course.course.ratings[k].id.userId)
        //                 if (user.userId === course.course.ratings[k].id.userId) {
        //                     console.log('gg')
        //                     setIsBought(true)
        //                     setUserRate(course.course.ratings[k].rating)
        //                     return;
        //                 }
        //             }
        //         }
        //     }
        // }
    }

    const getOtherCourses = () => {
        fetch(`http://localhost:8080/courses/${id}/participants/other-courses?user=${user.userId}`)
            .then(resp => resp.json())
            .then(data => setOtherCourses(data))
            .catch(err => setErr(true))
    }

    const handleBeingLiked = () => {
        courseModel.likedCourse ? setIsLiked(true) : setIsLiked(false)
    }

    const likeCourse = () => {
        fetch(
            `http://localhost:8080/users/${user.userId}/courses/${id}/course-liking`,
            { method: 'post' }
        )
            .then(resp => {
                if (resp.status === 204)
                    setIsLiked(true)
            })
            .catch(err => setErr(true))
    }

    const dislikeCourse = () => {
        fetch(
            `http://localhost:8080/users/${user.userId}/courses/${id}/course-liking`,
            { method: 'delete' }
        )
            .then(resp => {
                if (resp.status === 204)
                    setIsLiked(false)
            })
            .catch(err => setErr(true))
    }

    const addComment = (e) => {
        e.preventDefault();
        fetch(`http://localhost:8080/courses/${id}/comments`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                comment: {
                    text: commentForm.current.elements.comTxt.value
                },
                userId: user.userId
            })
        })
            .then(resp => {
                if (resp.status !== 201) {
                    resp.text().then(function (text) {
                        alert(text)
                        commentForm.current.reset()
                    });
                    throw 'Buy course first!';
                }
                else {
                    console.log(resp)
                    return resp.json()
                }
            })
            .then(newCom => {
                let copyCourse = { ...courseModel }
                const index = copyCourse.course.comments.length;
                copyCourse.course.comments[index] = newCom;
                setCourseModel(copyCourse)

                // upload comment image 
                const formData = new FormData()
                formData.append('File', selectedFile)

                fetch(`http://localhost:8080/courses/${id}/comments/${newCom.commentId}/img`, {
                    method: 'post',
                    body: formData
                })
                    .then(() => {
                        console.log('first then')
                        copyCourse.course.comments[index] = {
                            ...newCom,
                            image: {
                                image: `http://${process.env.REACT_APP_URL}:8080/courses/${id}/comments/${newCom.commentId}/img`
                            }
                        };
                        // REACT may not notice that something had changed the second time we called the setCourseModel in this method.
                        // When we use the "..." operator we pass a new object (copy) 
                        // so REACT will see that a change has occurred
                        setCourseModel({ ...copyCourse });
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => setErr(err))


    }

    // const uploadFile = () => {
    //     const formData = new FormData()
    //     formData.append('File', selectedFile)

    //     fetch(`localhost:8080/courses/${id}/comments/${}/img`, {
    //         method: 'post',
    //         body: formData
    //     })
    //         .then(resp => resp.json())
    //         .then(data => console.log(data))
    //         .catch(err => console.log(err))
    // }

    const changeHandler = (e) => {
        setSelectedFile(e.target.files[0])
    }

    return (
        <div className="course">
            {courseCategory && history.push(`/courses?category=${courseCategory}`)}
            {
                courseModel ?
                    <>
                        <img className="course__image" alt="noo" src={courseModel.course.image ? `http://${process.env.REACT_APP_URL}:8080/courses/${id}/img` : "/assets/react_js.jpg"} />
                        {/* <video controls autoPlay src={`http://${process.env.REACT_APP_URL}:8080/courses/${id}/img`} /> */}
                        <h1 className="course__title">
                            {courseModel.course.title}
                        </h1>
                        <p style={{ "fontSize": "23px", "color": "#34c8e2", "marginTop": "0" }}>
                            Related Categories:
                            {courseModel.course.categories.map(cat => {
                                return (
                                    <>
                                        <i style={{ "margin": "0 18px" }} onClick={() => getCategory(cat.id)}>{cat.name}</i>
                                    </>
                                )
                            })
                            }
                        </p>
                        <h2>
                            {getStars(courseModel.course.averageRating, false)}
                            ({courseModel.course.averageRating} / 5)
                        </h2>
                        {
                            isBought ?
                                <h3 className="course__vote">
                                    Your vote: {getStars(userRate, true)}{userVote && userVote + ".0"}
                                </h3>
                                :
                                <>
                                    {handleUserRate()}
                                    <p className="course__price">
                                        {courseModel.course.promotion ?
                                            <>
                                                {courseModel.course.promotion} $
                                                <strike style={{ "marginLeft": "20px", "fontSize": "30px", "color": "gray" }}>{courseModel.course.price} $</strike>
                                            </>
                                            :
                                            courseModel.course.price + "$"}
                                    </p>
                                    <button className="course__btn">Purchase</button>
                                </>
                        }
                        <p style={{ "margin": "5px 32%" }}>
                            30-day money-back guarantee
                        </p>
                        {isLiked === null && handleBeingLiked()}
                        <button
                            className="course__btn--smaller"
                            onClick={() => isLiked ? dislikeCourse() : likeCourse()}
                        >
                            {isLiked ? 'Remove from Favourites' : 'Add to Favourites'}
                        </button>
                        <hr width="100%" color="white"></hr>
                        <h1>{courseModel.course.description} . . .</h1>
                        {otherCourses ?
                            <>
                                <button
                                    className="course__btn--smaller"
                                    onClick={() => setOtherCourses(null)}
                                >
                                    HIDE other courses of this course participants
                                </button>
                                {otherCourses.map(anotherCourse => <CourseInMenu
                                    course={anotherCourse}
                                    setCourseRedirectID={setID}
                                    setShowLikedCourses={setShowLikedCourses}
                                    setCourseCategory={setCourseCategory}
                                />)}
                            </>
                            :
                            <button
                                className="course__btn--smaller"
                                onClick={() => getOtherCourses()}
                            >
                                Show other courses of this course participants
                            </button>
                        }
                        <div className="comments">
                            <h1 className="comments__title">Comments</h1>
                            {courseModel.course.comments.map(com => <Comment comment={com} courseId={id} />)}
                            <form className="comments__form" ref={commentForm} onSubmit={e => addComment(e)} >
                                <input type="text" name="comTxt" className="comments__form--input" placeholder="Write comment..." />
                                <input type="file" name="img" onChange={changeHandler} />
                                <button className="comments__form--btn">Add!</button>
                            </form>
                            {/* <form onSubmit={handleSubmission}>
                                <button>Submit</button>
                            </form> */}
                        </div>
                    </>
                    :
                    null
            }

        </div>
    )
}

export default Course;