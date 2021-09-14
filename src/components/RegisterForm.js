import { useRef } from 'react';

const RegisterForm = ({ setUser }) => {
    const formRef = useRef()

    const register = (e) => {
        e.preventDefault();
        fetch('http://localhost:8080/users', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: formRef.current.elements.name.value
            })
        })
            .then(resp => {
                if (resp.status !== 201) {
                    resp.text().then(function (text) {
                        alert(text)
                        formRef.current.reset()
                    });
                    throw 'User with given nick already exists';
                }
                else
                    return resp.json()
            })
            .then(newUser => setUser(newUser))
    }

    return (
        <div className="form">
            <form ref={formRef}>
                Create account on <b>Udemy</b>
                <p className="form__p">
                    <label>Your name:  </label>
                    <br></br>
                    <input name="name" type="text" className="form__input"></input>
                </p>
                <button
                    type="submit"
                    className="btn form__btn"
                    onClick={(e) => register(e)}
                >
                    Add me in!
                </button>
            </form>
        </div>
    )
}

export default RegisterForm;