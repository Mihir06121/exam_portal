export const studentLogin = (user) => {
    return fetch(`http://localhost:8000/api/student-login`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }).then(response => {
        return response.json()
    }).catch(error => 
        console.log("Login Error: ", error)
    )
}
