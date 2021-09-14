import { React, useRef, useState } from 'react'

const SignForm = ({ setUser }) => {
    const formRef = useRef();
    const [isErr, setIsErr] = useState(false);

    const logIn = (e) => {
        e.preventDefault();
        const [id, setId] = formRef.current.elements.id.value
        fetch(`http://localhost:8080/users/${id}`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: formRef.current.elements.id.value,
                name: formRef.current.elements.name.value
            })
        })
            .then(resp => resp.json())
            .then(data => setUser(data))
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
                    <label>Your ID number: </label>
                    <br></br>
                    <input name="id" type="number" className="form__input"></input>
                </p>
                <p className="form__p">
                    <label>Your name:  </label>
                    <br></br>
                    <input name="name" type="text" className="form__input"></input>
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