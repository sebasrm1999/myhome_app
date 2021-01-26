
import React,{useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './src/screens/Login';
import Registro from './src/screens/Registro';
import Inicio from './src/screens/Inicio';
import DescQueja from './src/screens/DescQueja';
import NuevaQueja from './src/screens/NuevaQueja';
import DescPago from './src/screens/DescPago';
import ProcesoPago from './src/screens/ProcesoPago';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
      screenOptions={{
        headerStyle : {
          backgroundColor: '#FFF'
        },
        headerTintColor: '#067d26'
      }}
      >
        <Stack.Screen
          name='Login'
          component={Login}
          options = {{title : ''}}
        />
        <Stack.Screen
          name='Registro'
          component={Registro}
          options = {{title : ''}}
        />
        <Stack.Screen
          name='Inicio'
          component={Inicio}
          options = {{title : 'Inicio'}}
        />
        <Stack.Screen
          name='DescQueja'
          component={DescQueja}
        />
        <Stack.Screen
          name='NuevaQueja'
          component={NuevaQueja}
          options={{title: 'Nueva Queja'}}
        />
        <Stack.Screen
          name='DescPago'
          component={DescPago}
        />
        <Stack.Screen
          name='ProcesoPago'
          component={ProcesoPago}
          options={{title: 'Pagar'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
