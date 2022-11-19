import {View} from 'react-native'
import {Text} from '@rneui/base'
import { TextInput, Button } from 'react-native-paper'
import { useState } from 'react'
import { studentLogin } from '../actions/auth'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from '../contexts/Auth';

export const Login = () => {

    const [email, setEmail] = useState('student1@gmail.com')
    const [password, setPassword] = useState('12345678')
    const [error, setError] = useState('')

    const navigation = useNavigation()

    const auth = useAuth();

    const emailRegex = /\S+@\S+\.\S+/;

    const handleSubmit = (user) => {
        if (email === '' || password === '') {
            return setError("All fields are required")
        }

        if (emailRegex.test(email)) {
            auth.signIn(user)
        } else {
            setError("Please Enter Valid Email")
        }
    }
    
    return (
        <View style={{
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%'
        }}>
            <View style={{
                width: '90%'
            }}>
                <TextInput
                    mode='outlined'
                    label="Email"
                    keyboardType='email-address'
                    value={email}
                    onChangeText={email => {setEmail(email)
                    setError('')}}
                />
                <TextInput
                    mode='outlined'
                    keyboardType='password'
                    secureTextEntry
                    label="Password"
                    value={password}
                    onChangeText={password => {setPassword(password)
                        setError('')}}
                />
                {error !== ''? <Text style={{
                    color: 'red',
                    justifyContent:'center'
                }}>{error}</Text> : null}
                <Button style={{
                    margin: 10
                }} onPress={() => handleSubmit(user = {email, password})} mode='contained'>
                    Login
                </Button>
            </View>
        </View>
    )
}