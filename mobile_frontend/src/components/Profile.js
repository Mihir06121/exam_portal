import {useEffect, useState} from 'react';
import {Button, ScrollView, View} from 'react-native';
import { Text } from '@rneui/base';
import {useAuth} from '../contexts/Auth';

export const Profile = ({navigation}) => {

    const auth = useAuth();

    const user = auth.authData
    const signOut = () => {
        auth.signOut();
    };

    const [testData, setTestData] = useState(null)
    // const [testRawData, setTestRawData] = useState({})

    useEffect(() => {
        getResults()
    }, [])

    const getResults = (studentId = auth.authData.user._id) => {
        fetch(`http://localhost:8000/api/get-student-results/${studentId}`, {
            method: 'GET',
            headers: {
                Accept: "application/json",
                'Content-Type': 'application/json'
            }
        }).then(res => {
            res.json().then(text => {
                setTestData(text)
                // setTestRawData(text.testRawData)
            })
        })
    }

    return (
        <View style={{
            margin: 10,
            flex: 1
        }}>
            <View style={{paddingVertical: 10}}>
                <View style={{
                    marginVertical: 10 
                }}>
                    <Text h4>Name: {user.user.firstName} {user.user.lastName}</Text>
                    <Text h4>Email: {user.user.email}</Text>
                    <Text h4>Mb: {user.user.mobileNumber}</Text>
                    <Text h4>Status: {user.user.isSubscribed ? <Text>Subscribed</Text> : <Text>Not Subscribed</Text>}</Text>
                </View>
                {user.user.isSubscribed ? <View style={{
                    paddingVertical: 10
                }}>
                    <Button
                    onPress={() => navigation.navigate('Questions')}
                    title="Appear for exam"/>
                </View> : <View>
                </View>}
                    <Button title="Sign Out" color={"red"} onPress={signOut} />
                </View>
            <View style={{
                borderBottomColor: 'black',
                borderBottomWidth: 1,
            }}></View>
            <View style={{flex: 1}}>
                <Text h4 style={{
                    textAlign: 'center'
                }}>Results</Text>
                <View style={{
                    flex: 1
                }}>
                    <ScrollView>
                        {testData === null ? null : 
                        (testData.map((data, i) => (
                            <View key={i} style={{
                                paddingVertical: 5
                            }}>
                                <Text>{data.course.courseName}</Text>
                                <Text>{data.course.courseType}</Text>
                                <Text>Score: {data.score}</Text>
                                <View style={{
                                    borderBottomColor: 'black',
                                    borderBottomWidth: 1,
                                }}></View>
                            </View>
                        )))}
                    </ScrollView>
                </View>
            </View>
        </View>
    );
};