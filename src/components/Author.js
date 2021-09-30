import { useRef } from 'react'

const Author = () => {
    const form = useRef()

    const submit = (e) => {
        e.preventDefault()
        fetch(`http://localhost:8080/authors`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: form.current.elements.name.value,
                occupation: form.current.elements.occupation.value,
                description: form.current.elements.description.value
            })
        })
            .then(r => console.log(r))
    }

    return (
        <form onSubmit={(e) => submit(e)} ref={form}>
            <input type="text" name="name" />
            <input type="text" name="occupation" />
            <input type="text" name="description" />
            <button>Create</button>
        </form>
    )
}

export default Author;