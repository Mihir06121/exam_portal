import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
//Create the Auth Context with the data type specified
//and a empty object
const AuthContext = createContext({});
const AuthProvider = ({ children }) => {
    const [authData, setAuthData] = useState();
    //the AuthContext start with loading equals true
    //and stay like this, until the data be load from Async Storage
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState(null)
    useEffect(() => {
        //Every time the App is opened, this provider is rendered
        //and call de loadStorage function.
        loadStorageData();
    }, []);
    async function loadStorageData() {
        try {
            //Try get the data from Async Storage
            authDataSerialized = await AsyncStorage.getItem('@AuthData')
            if (authDataSerialized) {
                //If there are data, it's converted to an Object and the state is updated.
                const authData = JSON.parse(authDataSerialized);
                setAuthData(authData);
                getQuestionsForStudent(authData.user.selectedCourse)
            }
        }
        catch (error) {
            console.log(error)
        }
        finally {
            //loading finished
            setLoading(false);
        }
    }
    const signIn = (user) => {
        //call the service passing credential (email and password).
        fetch(`http://localhost:8000/api/student-login`, {
            method: 'POST',
            headers: {
                Accept: "application/json",
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        }).then(response => {
            response.json().then(text => {
                setAuthData(text);
                AsyncStorage.setItem('@AuthData', JSON.stringify(text));
                getQuestionsForStudent(text.user.selectedCourse)
            })
        }).catch(err => {
            console.log(err)
        })
        //Set the data in the context, so the App can be notified
        //and send the user to the AuthStack
        //Persist the data in the Async Storage
        //to be recovered in the next user session.
    };

    const getQuestionsForStudent = (courseId) => {
        fetch(`http://localhost:8000/api/question-for-student/${courseId}`, {
            method: 'GET',
            headers: {
                Accept: "application/json",
                'Content-Type': 'application/json'
            },
        }).then(response => {
            response.json().then(q => {
                setQuestions(q)
            })
        }).catch(err => {
            console.log(err)
        })
    }

    const signOut = () => {
        //Remove data from context, so the App can be notified
        //and send the user to the AuthStack
        setAuthData(undefined);
        // setQuestions(null)
        //Remove the data from Async Storage
        //to NOT be recoverede in next session.
        AsyncStorage.removeItem('@AuthData');
    };
    return (
    //This component will be used to encapsulate the whole App,
    //so all components will have access to the Context
    React.createElement(AuthContext.Provider, { value: { authData, questions, loading, signIn, getQuestionsForStudent, signOut } }, children));
};
//A simple hooks to facilitate the access to the AuthContext
// and permit components to subscribe to AuthContext updates
function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
export { AuthContext, AuthProvider, useAuth };