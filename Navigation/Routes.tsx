import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ChatScreen from '../Chat/ChatScreen';
import IndividualChat from '../Chat/IndividualChat';

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='ChatScreen'>
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="IndividualChat" component={IndividualChat} />
      </Stack.Navigator>


    </NavigationContainer>
  );
}
