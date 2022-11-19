import { createContext, useContext } from 'react'

export const login = (user) => {
    return fetch(`http://localhost:8000/api/login`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }).then(response => {
        return response.json()
    }).catch(err => 
        console.log("Login Err: ", err)
    )
}

export const loginSubAdmin = (user) => {
    return fetch(`http://localhost:8000/api/login-sub-admin`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }).then(response => {
        return response.json()
    }).catch(err => 
        console.log("Login Err: ", err)
    )
}

export const register = (user) => {
    return fetch(`http://localhost:8000/api/register`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }).then(response => {
        return response.json()
    }).catch(err => {
        console.log("Register Err: ", err)
    })
}

export const authenticate = (data, next) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('jwt', JSON.stringify(data));
        next();
    }
};

export const isAuthenticated = () => {
    if (typeof window == 'undefined') {
        return false;
    }
    if (localStorage.getItem('jwt')) {
        return JSON.parse(localStorage.getItem('jwt'));
    } else {
        return false;
    }
};

export const logout = next => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('jwt');
    }
};

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    
    let contextUser = isAuthenticated()

    return (
        <AuthContext.Provider value={{ contextUser, authenticate, login, logout }}>
        {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
  return useContext(AuthContext)
}

export const registerCenterUser = (user) => {
    return fetch(`http://localhost:8000/api/register-center-user`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }).then(response => {
        return response.json()
    }).catch(err => {
        console.log("Register Err: ", err)
    })
}

export const getListUsers = (userRole) => {
    return fetch(`http://localhost:8000/api/get-admin-list-user/${userRole}`,{
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

export const activateUser = (data) => {
    return fetch(`http://localhost:8000/api/activate-user`, {
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

export const deActivateUser = (data) => {
    return fetch(`http://localhost:8000/api/de-activate-user`, {
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

export const getNotAssignedUser = (userId) => {
    return fetch(`http://localhost:8000/api/get-not-assigned-users/${userId}`,{
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

export const getNonActiveSubUser = (userId, userRole) => {
    return fetch(`http://localhost:8000/api/get-disabled-users/${userId}/${userRole}`, {
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

export const updateDeactivatedData = (data) => {
    return fetch(`http://localhost:8000/api/update-deactivate-data/`, {
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