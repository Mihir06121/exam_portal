export const getUsers = (userRole) => {
    // console.log(userRole)
    return fetch(`http://localhost:8000/api/get-users-for-center/${userRole}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
            // Authorization: `Bearer ${token}`
        },
    }).then(response => {
        return response.json()
    }).catch(err => 
        console.log("GET USER ", err)    
    )
}

export const createCenterSub = (data) => {
    return fetch(`http://localhost:8000/api/create-center`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
            // Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
    }).then(response => {
        return response.json()
    }).catch(err => {
        console.log('CREATE CENTER ERR: ', err)
    })
} 

export const getSubCenter = (userId) => {
    return fetch(`http://localhost:8000/api/get-sub-center/${userId}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        }
    }).then(response => {
        return response.json()
    }).catch(err =>
        console.log("GET_SUB_CENTER", err)    
    )
} 

export const deleteCenter = (centerId, assignedToId) => {
    return fetch(`http://localhost:8000/api/delete-sub-center/${centerId}/${assignedToId}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        }
    }).then(response => {
        return response.json()
    }).catch(err => {
        console.log(err)
    })
}

export const updateSubCenter = (data) => {
    return fetch(`http://localhost:8000/api/update-sub-center/`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        return response.json()
    }).catch(err => {
        console.log(err)
    })
}

export const getUserCenter = async (userId) => {
    return await fetch(`http://localhost:8000/api/get-user-center/${userId}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        },
    }).then(response => {
        return response.json()
    }).catch(err => {
        console.log(err)
    })
}

export const getAdminCenters = (userRole) => {
    return fetch(`http://localhost:8000/api/get-all-center/${userRole}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        },
    }).then(response => {
        return response.json()
    }).catch(err => 
        console.log("GET USER ", err)    
    )
}

export const registerStudent = (data) => {
    return fetch(`http://localhost:8000/api/register-student`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        return response.json()
    }).catch(err => {
        console.log(err)
    })
}

export const getCenterStudents = (centerId) => {
    return fetch(`http://localhost:8000/api/get-center-students/${centerId}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(response => {
        return response.json()
    }).catch(err => {
        console.log(err)
    })
}

export const subscribeStudent = (data) => {
    return fetch(`http://localhost:8000/api/subscribe-student`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        localStorage.setItem('response', JSON.stringify(response));
        return response.json()
    }).catch(err => {
        console.log(err)
    })
}

export const getSingleCenterAdmin = (subcId) => {
    return fetch(`http://localhost:8000/api/get-center-admin/${subcId}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(response => {
        return response.json()
    }).catch(err => {
        console.log(err)
    })
}

export const createCourse = (data) => {
    return fetch(`http://localhost:8000/api/create-course`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(data)
    }).then(response => {
        return response.json()
    }).catch(err => console.log(err))
}

export const getCourses = () => {
    return fetch(`http://localhost:8000/api/get-courses`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(response => {
        return response.json()
    }).catch(err => {
        console.log(err)
    })
}

export const updateSubUser = (data) => {
    return fetch(`http://localhost:8000/api/update-sub-user`, {
        method: 'PUT',
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

export const getSingleStudentAdmin = (studentId) => {
    return fetch(`http://localhost:8000/api/get-single-student-admin/${studentId}`, {
        method:'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(response => {
        return response.json()
    }).catch(err => {
        console.log(err)
    })
}

export const getStudentsResults = (studentId) => {
    return fetch(`http://localhost:8000/api/get-single-student-admin-results/${studentId}`, {
        method:'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(response => {
        return response.json()
    }).catch(err => {
        console.log(err)
    })
}