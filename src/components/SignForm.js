import { React, useRef, useState } from 'react'

const SignForm = ({ setUser }) => {
    const formRef = useRef();
    const [isErr, setIsErr] = useState(false);

    const logIn = (e) => {
        e.preventDefault();
        fetch(`http://localhost:8080/oauth/login`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: formRef.current.elements.name.value,
                password: formRef.current.elements.password.value
            })
        })
            .then(resp => resp.json())
            .then(data => setUser(data.user))
            .catch(err => {
                setIsErr(true)
                console.log(err)
            })
    }

    return (
        <div className="form">
            <form ref={formRef}>
                Log in to <b>Udemy</b>
                <p className="form__p">
                    <label>Your name:  </label>
                    <br></br>
                    <input name="name" type="text" className="form__input"></input>
                </p>
                <p className="form__p">
                    <label>Your password: </label>
                    <br></br>
                    <input name="password" type="password" className="form__input"></input>
                </p>
                <button
                    type="submit"
                    className="btn form__btn"
                    onClick={e => logIn(e)}
                >
                    Log In
                </button>
            </form>
            {isErr && <div className="err">
                <i>Your data are not valid :(</i>
            </div>}
        </div>
    )
}

export default SignForm;