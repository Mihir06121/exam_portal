export const createQuestion  = (data) => {
    console.log(data)
    return fetch(`http://localhost:8000/api/create-question`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        return response.json()
    }).catch(err => {
        console.log(err)
    }) 
}

export const getAllQuestions = () => {
    return fetch(`http://localhost:8000/api/get-all-questions`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
    }).then(response => {
        return response.json()
    }).catch(err => {
        console.log(err)
    }) 
}