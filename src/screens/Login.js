import React, {useState} from 'react';
import { Alert, Image, StyleSheet, Text, View, ImageBackground } from 'react-native';
import {FontAwesome5} from '@expo/vector-icons';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import * as SecureStore from 'expo-secure-store';
import {baseUrl} from '../libs/listas';
import Loader from '../components/Loader';
import Axios from 'axios';

export default function Login(props){
    const [cargando, setCargando] = useState(false);
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    return cargando ? <Loader
    mensaje='Autenticando, por favor espera...'/> : (
            <ImageBackground source={require('../../assets/images/index.jpg')} style={styles.backgroundImage} >
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <View style={styles.container}>
                        <FontAwesome5 name="home" size={50} color='#adc867'/>
                        <TextInput
                        style={styles.textinput}
                        placeholder="Correo electrónico"
                        placeholderTextColor="#999594"
                        keyboardType="email-address"
                        onChange={val => setCorreo(val.nativeEvent.text)}
                        />
                        <TextInput
                        style={styles.textinput}
                        placeholder="Contraseña"
                        secureTextEntry={true}
                        placeholderTextColor="#999594"
                        keyboardType="default"
                        onChange={val => setPassword(val.nativeEvent.text)}
                        />
                        <View style={{flexDirection: 'row'}}>
                            <Text>¿Aún no tienes una cuenta?</Text>
                            <TouchableOpacity
                            onPress={() => props.navigation.navigate('Registro')}
                            >
                            <Text
                            style={{color: '#067d26', marginLeft: 4}}
                            >
                                Regístrate aquí
                            </Text>
                        </TouchableOpacity>    
                        </View>
                        <TouchableOpacity
                        onPress={()=>{
                            if(correo.length > 0 && password.length > 0){
                                setCargando(true);
            
                                let formData = new FormData();
                                formData.append('correo', correo);
                                formData.append('contrasenia', password);
                                Axios({
                                    method: 'post',
                                    url: `${baseUrl}BackEnd/login`,
                                    data: formData,
                                    headers: {'Content-Type': 'multipart/form-data'} 
                                })
                                .then(json => {
                                    console.log(json.data);
                                    setCargando(false);
                                    if(json.data.resultado){

                                        if(json.data.usuario[0].verificado != 0 || json.data.usuario[0].verificado != '0'){
                                            if(json.data.usuario[0].tipo == 1){
                                                SecureStore.setItemAsync(
                                                    'id',
                                                    json.data.usuario[0].id_usuario
                                                );
                                                SecureStore.setItemAsync(
                                                    'nombre',
                                                    json.data.usuario[0].nombre
                                                );
                                                SecureStore.setItemAsync(
                                                    'email',
                                                    correo
                                                );
                                                Alert.alert('Bienvenido', 
                                                `Hola de nuevo ${json.data.usuario[0].nombre}`,
                                                [{
                                                    text: 'Continuar', 
                                                    onPress: () => props.navigation.replace('Inicio')
                                                }],
                                                {cancelable: false}
                                                );
                                            } else {
                                                Alert.alert('Error', 'Correo o contraseña incorrectos...');
                                            }
                                        } else {
                                            Alert.alert('Error', 'Su cuenta aún no ha sido verificada...');
                                        }
                                        
                                    } else {
                                        Alert.alert('Error', 'Correo o contraseña incorrectos...');
                                    }
                                })
                                .catch((error) => {
                                    console.log(error);
                                    Alert.alert('ERROR', 'Ocurrió un error, por favor intenta nuevamente');
                                    setCargando(false);
                                }
                                );
                            }else{
                                Alert.alert(
                                    'Alto!',
                                    'Favor de ingresar su correo y contraseña...'
                                );
                            }
                        }}
                        >
                            <Text
                            style={styles.boton}
                            >
                                Iniciar Sesión
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
    );
}

let styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      width: null,
        height: null
    },
    container : {
        backgroundColor: '#FFF',
        opacity: 0.9,
        width: '90%',
        height: '70%',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 4
    },
    textinput:{
        borderBottomWidth: 2,
        borderBottomColor: '#067d26',
        width : '80%',
        height: 50
    },
    boton:{
        backgroundColor: '#adc867',
        padding: 5,
        borderRadius: 5,
        color: '#FFF',
        fontSize: 20
    },
    label: {
        alignSelf: 'flex-start',
        fontWeight: 'bold',
        marginLeft: 10,
        marginBottom: -25
    }
  });