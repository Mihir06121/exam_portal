import { View, Button } from "react-native";
import { Text } from "@rneui/base";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/Auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ResultSubmit = ({route, navigation}) => {

    const [response, setResponse] = useState(null)
    const { sudoData, student_id, course } = route.params;
    const studentId = student_id

    const auth = useAuth();

    useEffect(() => {
        submitTestResult(sudoData, studentId, course)
    }, [])

    const signOut = () => {
        auth.signOut();
    };

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

        // fetch(`http://localhost:8000/api/post-result`, {
        //     method: 'POST',
        //     headers: {
        //         Accept: 'application/json',
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(data)
        // }).then( res => {
        //     res.json().then(text => {
        //         setResponse(text)
        //         if (text.updated === true) {
        //         }
        //     })
        // }).catch(err => {
        //     console.log(err)
        // })
    }

    return (
        <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
            }}>
            <Text h3 style={{
                margin: 10
            }}>Result Submitted</Text>
            {/* <Text>{JSON.stringify(response.score)}</Text> */}
            <Button title="Back to profile" onPress={signOut} />
        </View>
    )
}