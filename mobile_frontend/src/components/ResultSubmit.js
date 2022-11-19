import { View } from "react-native";
import { Text } from "@rneui/base";
import { useEffect, useState } from "react";
import { Button } from "react-native-paper";
import {useAuth} from '../contexts/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const ResultSubmit = ({route, navigation}) => {

    const [response, setResponse] = useState(null)
    let auth = useAuth()
    const { sudoData, student_id, course } = route.params;
    const studentId = student_id

    const submitTestResult = (sudoData, studentId, course) => {
        let score = 0
        for(let i = 0; i < sudoData.length; i++) {
            // console.log(sudoData[i].isCorrect);
            if(sudoData[i].isCorrect === true) {
                score = score + 1
            }
        }
        let data = {
            testRawData: sudoData,
            studentId,
            course,
            score
        }
        fetch(`http://localhost:8000/api/post-result`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then( res => {
            res.json().then(text => {
                setResponse(text)
                if (text.updated === true) {
                    auth.signOut();
                }
            })
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
            }}>
            <Text h3 style={{
                margin: 10
            }}>Completed the test?</Text>
            <Text>{JSON.stringify(auth.authData.user)}</Text>
            <Button style={{
                margin: 10
            }}
                mode="contained"
                color="#5cb85c"
                onPress={() => submitTestResult(sudoData, studentId, course)}>Submit</Button>
            <Button style={{
                margin: 10
            }}
                onPress={() => navigation.navigate('Questions')}>Go Back</Button>
        </View>
    )
}