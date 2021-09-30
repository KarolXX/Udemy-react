import { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import { FaHeart, FaSearch, FaUserGraduate } from 'react-icons/fa';

import './App.scss';
import StartPage from './components/StartPage';
import MainPage from './components/MainPage';
import Course from './components/Course';
import Author from './components/Author';

function App() {
  const [user, setUser] = useState(null);

  const [courses, setCourses] = useState();
  const [courseRedirectID, setCourseRedirectID] = useState(null)
  const [showLikedCourses, setShowLikedCourses] = useState(false)
  const [courseCategory, setCourseCategory] = useState(null)

  console.log('RENDER app')

  const getUserLikedCourses = () => {
    if (user) {
      fetch(`http://localhost:8080/users/${user.userId}/favourite-courses`)
        .then(resp => resp.json())
        .then(data => {
          setCourseRedirectID(null)
          setCourses(data)
          setShowLikedCourses(true)
        })
        .catch(err => console.log(err));
    }
    else
      return;
  }

  return (
    < Router >
      {user && <div className="nav">
        <p className="nav__item">
          <FaHeart
            size="3em"
            color="white"
          //onClick={() => getUserLikedCourses()}
          />
          {/* FIXME */}
          {
            showLikedCourses
            &&
            <Redirect to={`../users/${user.userId}/favourite-courses`} />
          }
        </p>
        <p className="nav__item--title">
          <h1 className="title">Udemy</h1>
        </p>
        <p className="nav__item--last-item">
          <FaSearch size="3em" color="white" />
          <FaUserGraduate size="3em" color="white" />
        </p>
      </div>}
      <Switch>
        <Route path="/authors" render={() => <Author />} />
        <Route exact path="/" render={() => <StartPage user={user} setUser={setUser} />} />
        <Route exact path="/courses" render={() => <MainPage
          user={user} setUser={setUser}
          courses={courses} setCourses={setCourses}
          courseRedirectID={courseRedirectID} setCourseRedirectID={setCourseRedirectID}
          showLikedCourses={showLikedCourses} setShowLikedCourses={setShowLikedCourses}
          courseCategory={courseCategory} setCourseCategory={setCourseCategory}
        />} />
        <div className="dark-spectrum-bg">
          <Route exact path="/courses/:id" render={() => <Course
            id={courseRedirectID}
            setID={setCourseRedirectID}
            user={user}
            courseCategory={courseCategory}
            setCourseCategory={setCourseCategory}
            setShowLikedCourses={setShowLikedCourses}
          />}
          />
          <Route path="/courses?category=:id" render={() => <MainPage
            user={user} setUser={setUser}
            courses={courses} setCourses={setCourses}
            courseRedirectID={courseRedirectID} setCourseRedirectID={setCourseRedirectID}
            showLikedCourses={showLikedCourses} setShowLikedCourses={setShowLikedCourses}
            courseCategory={courseCategory} setCourseCategory={setCourseCategory}
          />}
          />
          {/* <Route path="/users/:id/favourite-courses" render={() => <MainPage
            user={user} setUser={setUser}
            courses={courses} setCourses={setCourses}
            courseRedirectID={courseRedirectID} setCourseRedirectID={setCourseRedirectID}
            showLikedCourses={showLikedCourses} setShowLikedCourses={setShowLikedCourses}
            courseCategory={courseCategory} setCourseCategory={setCourseCategory}
          />}
          /> */}
        </div>
      </Switch>
    </Router >
  );
}

export default App;
