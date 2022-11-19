import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Profile} from '../components/Profile';
import {QuestionScreen} from '../components/Questions'
import {ResultSubmit} from '../components/ResultSubmit'
const Stack = createNativeStackNavigator();

export const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home Screen" component={Profile} />
      <Stack.Screen options={{headerShown: false}} name="Questions" component={QuestionScreen} />
      <Stack.Screen options={{headerShown: false}} name="Result-Submit" component={ResultSubmit} />
    </Stack.Navigator>
  );
};