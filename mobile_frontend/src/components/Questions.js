import { ScrollView, View } from "react-native";
import { Button } from "react-native-paper";
import { Text } from "@rneui/base";
import {useAuth} from '../contexts/Auth';
import { useEffect, useState } from "react";

export const QuestionScreen = ({navigation}) => {

    const auth = useAuth();
    const quest = auth.questions
    console.log("TRDFGHJKL", quest[0].course)
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [choosenOption, setChoosenOption] = useState('')

    const [sudoData, setSudoData] = useState([])

    const onhandleNext = () => {
        if (currentQuestion <= Object.keys(quest).length) {
            if (currentQuestion + 1 < Object.keys(quest).length) {
                setCurrentQuestion(currentQuestion + 1)
            }
        }
    }

    useEffect(() => {
        createSudoArray(quest)
    }, [])

    const createSudoArray = (quest) => {
        const newArr = quest.map((q, i) => {
            return response = {
                questionId: q._id,
                isAttempted: false,
                isCorrect: false,
                optionSelected: ''
            }
            
        })
        setSudoData(newArr)
    }

    const onhandlePrevious = () => {
        if (currentQuestion >= 0) {
            if (currentQuestion - 1 >= 0) {
                setCurrentQuestion(currentQuestion - 1)
            }
        }
    }

    const updateExistingAnswer = function(arr, attr, value, choosenOption){
        var i = arr.length;
        while(i--){
            if( arr[i] && arr[i].hasOwnProperty(attr) && (arguments.length > 2 && arr[i][attr] === value._id ) ){
                // arr.splice(i,1);
                arr[i].isAttempted = true,
                arr[i].isCorrect = value.optionCorrect === choosenOption
                arr[i].optionSelected = choosenOption
                return arr;
            }
        }
    }

    const handleOptionChose = (choosenOption, quesData) => {
        if (sudoData.length === 0) {
            let response = {
                questionId: quesData._id,
                isAttempted: `${choosenOption === '' ? false : true}`,
                isCorrect: choosenOption === quesData.optionCorrect,
                optionSelected: choosenOption
            }
            setSudoData([...sudoData, response])
        setChoosenOption('')

        }
        
        if (sudoData.length > 0) {
            console.log(updateExistingAnswer(sudoData, 'questionId', quesData, choosenOption))
            // let response = {
            //     questionId: quesData._id,
            //     isAttempted: `${choosenOption === '' ? false : true}`,
            //     isCorrect: choosenOption === quesData.optionCorrect,
            //     optionSelected: choosenOption
            // }
            // setSudoData([...sudoData, response])
        }
        setChoosenOption('')
    }

    const handleSubmit = () => {
        return navigation.navigate('Result-Submit', {sudoData, student_id: auth.authData.user._id, course: quest[0].course})
    }
    return (
        <View style={{flex:1}}>
            <View style={{
                flex:3,
                margin: 10
            }}>
                <ScrollView>
                    <Text h2>Q{currentQuestion + 1}. {quest[currentQuestion].questionData}</Text>
                    <Text>{JSON.stringify(sudoData)}</Text>
                </ScrollView>
            </View>
            <View style={{
                flex: 2
            }}>
                <View>
                    <Text h4 style={{
                        marginHorizontal: 10
                    }}>Choosen Option: {choosenOption}</Text>
                    {quest[currentQuestion].options.map((o, i) => (
                        <View style={{
                            margin: 10
                        }} key={i}>
                            <Button onPress={() => 
                                setChoosenOption(o.name)} 
                                color="#5cb85c" mode="contained" >{o.name}
                            </Button>
                        </View>
                    ))}
                </View>
            </View>
            <View style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-around",
                alignContent: 'center'
            }}>
                <View style={{
                justifyContent: "center",
                }}>
                    {currentQuestion > 0 ? 
                    <Button color="#0275d8" mode="contained" onPress={() => onhandlePrevious()}>
                        Prev
                    </Button> : null }
                </View>
                <View style={{
                justifyContent: "center",
                }}>
                    {currentQuestion + 1 !== Object.keys(quest).length ? 
                    <Button color="#0275d8" mode="contained" onPress={() => {onhandleNext()
                        {choosenOption !== '' ? handleOptionChose(choosenOption, quest[currentQuestion]) : null}
                        }}>
                        Next
                    </Button> : 
                    <Button color="#0275d8" mode="contained" onPress={() => {handleOptionChose(choosenOption, quest[currentQuestion])
                    handleSubmit(sudoData)}}>
                        Submit
                    </Button>}
                </View>
            </View>
        </View>
    )
}