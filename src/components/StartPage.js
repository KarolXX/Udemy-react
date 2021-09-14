import { useState } from "react";
import { Redirect } from "react-router-dom";

import RegisterForm from './RegisterForm'
import SignForm from './SignForm';

const StartPage = ({ user, setUser }) => {
    const [formType, setFormType] = useState("SignForm");

    return (
        <div className="App winter-spectrum-bg">
            <div className="header-start-page">
                <p>
                    <b className="keyword">Udemy </b> is a platform that allows instructors to build online courses on their preferred topics. Using Udemy's course development tools, they can upload videos...
                </p>
                <p>
                    <button className="btn header-start-page__btn" onClick={() => setFormType("SignForm")}>Sign in</button>
                    <button className="btn header-start-page__btn" onClick={() => setFormType("RegisterForm")}>Sign up</button>
                </p>
            </div>
            <div>
                {
                    user ?
                        <Redirect to="/courses" />
                        :
                        formType === "SignForm" ?
                            <SignForm setUser={setUser} />
                            :
                            <RegisterForm setUser={setUser} />
                }
            </div>
        </div>
    );
}

export default StartPage;