import React, { useState, useEffect } from 'react';
import { Alert, Image, StyleSheet, Picker, Text, View, ImageBackground } from 'react-native';
import {FontAwesome5} from '@expo/vector-icons';
import { TextInput, TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as SecureStore from 'expo-secure-store';
import {baseUrl} from '../libs/listas';
import Loader from '../components/Loader';
import Axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
 
 
var radio_props = [
  {label: 'Soy propietario', value: 0 },
  {label: 'No soy propietario', value: 1 }
];

export default function Registro(props){
    const [radio, setRadio] = useState(1);
    const [nombre, setNombre] = useState('');
    const [calle, setCalle] = useState('');
    const [numero, setNumero] = useState('');
    const [telefono, setTelefono] = useState('');
    const [comprobante, setComprobante] = useState('');
    const [correo, setCorreo] = useState('');
    const [subcolonias, setSubcolonias] = useState(null);
    const [selectedValue, setSelectedValue] = useState('0');
    const [password, setPassword] = useState('');
    const [passwordConf, setPasswordConf] = useState('');
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
		setCargando(true);
		async function getUserData() {
			Axios({
				method: 'post',
				url: `${baseUrl}BackEnd/subcolonias`,
				headers: {'Content-Type': 'multipart/form-data'} 
			})
			.then(json => {
                if(json.data != null){
                    setSubcolonias(json.data.subcolonias);
                }
                setCargando(false);
			})
			.catch((error) => {
				console.log(error);
				Alert.alert('ERROR', 'Ocurrió un error inesperado, por favor intenta nuevamente');
				setCargando(false);
			}
            );
            
		}
        getUserData();
    }, []);

    async function tomarDocumento(){
        let result = await DocumentPicker.getDocumentAsync({});
            result.type = 'image/jpeg'
          console.log(result);
          setComprobante(result);
    }

    return cargando ? <Loader
    mensaje='Cargando, por favor espera...'/> : (
            <ImageBackground source={require('../../assets/images/index.jpg')} style={styles.backgroundImage} >
                <KeyboardAwareScrollView>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
                    
                    <View style={styles.container}>
                        <Text style={{color: '#adc867', fontSize: 30, fontWeight:'bold'}}>Registro</Text>
                        <TextInput
                        style={styles.textinput}
                        placeholder="Nombre Completo"
                        placeholderTextColor="#999594"
                        keyboardType="default"
                        onChange={val => setNombre(val.nativeEvent.text)}
                        />
                        <View style={{flexDirection: 'row', marginHorizontal: 30}}>
                            <View style={{flex: 3}}>
                                <TextInput
                                style={styles.textinput}
                                placeholder="Calle"
                                placeholderTextColor="#999594"
                                keyboardType="default"
                                onChange={val => setCalle(val.nativeEvent.text)}
                                />
                            </View>
                            <View style={{flex: 1}}>
                                <TextInput
                                style={styles.textinput}
                                placeholder="Número"
                                placeholderTextColor="#999594"
                                keyboardType="number-pad"
                                onChange={val => setNumero(val.nativeEvent.text)}
                                />
                            </View>
                        </View>
                        <TextInput
                        style={styles.textinput}
                        placeholder="Teléfono"
                        placeholderTextColor="#999594"
                        keyboardType="phone-pad"
                        maxLength={10}
                        onChange={val => setTelefono(val.nativeEvent.text)}
                        />
                        <View style={{marginLeft: -10, marginTop:5}}>
                        <RadioForm
                        formHorizontal={true}
                        animation={true}
                        >
                        {/* To create radio buttons, loop through your array of options */}
                        {
                            radio_props.map((obj, i) => (
                            <RadioButton labelHorizontal={true} key={i} >
                                {/*  You can set RadioButtonLabel before RadioButtonInput */}
                                <RadioButtonInput
                                obj={obj}
                                index={i}
                                isSelected={radio === i}
                                onPress={(value) => {setRadio(value)}}
                                borderWidth={1}
                                buttonInnerColor={'#067d26'}
                                buttonOuterColor={radio === i ? '#067d26' : '#000'}
                                buttonSize={20}
                                buttonOuterSize={30}
                                buttonStyle={{}}
                                buttonWrapStyle={{marginLeft: 10}}
                                />
                                <RadioButtonLabel
                                obj={obj}
                                index={i}
                                labelHorizontal={true}
                                labelStyle={{fontSize: 13, color: '#000'}}
                                labelWrapStyle={{}}
                                />
                            </RadioButton>
                            ))
                        }  
                        </RadioForm>
                        </View>
                        <Text style={{width:'80%'}}>Subcolonia</Text>
                        <Picker
                            selectedValue={selectedValue}
                            style={{ height: 50, width: '90%', marginHorizontal: 15, padding: 5 }}
                            onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                        >
                            <Picker.Item key={0} label={'---'} value={'0'} />
                            {subcolonias != null ? subcolonias.map((item, index) => {
                                return(
                                    <Picker.Item key={index+1} label={item.nombre} value={item.id_area} />
                                );
                            }) : <View></View>}
                        </Picker>

                        <Text style={{width:'80%'}}>
                            Favor de Subir Comprobante de domicilio menor a 3 meses:
                        </Text>

                        <TouchableOpacity
                        onPress={() => {
                            tomarDocumento();
                        }}
                        >
                            <Text
                            style={{
                                backgroundColor: '#067d26',
                                color: '#FFF',
                                fontWeight: 'bold',
                                padding: 5,
                                borderRadius: 5,
                                paddingHorizontal: 60
                            }}
                            >Subir documento aquí</Text>
                        </TouchableOpacity>
                        
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
                        <TextInput
                        style={styles.textinput}
                        placeholder="Confirmar Contraseña"
                        secureTextEntry={true}
                        placeholderTextColor="#999594"
                        keyboardType="default"
                        onChange={val => setPasswordConf(val.nativeEvent.text)}
                        />
                        <TouchableOpacity
                        onPress={()=>{
                            if(correo.length > 0 && password.length > 0 && nombre.length > 0 && calle.length > 0 && numero.length > 0 && passwordConf.length > 0 && telefono.length > 0 && comprobante != ''){
                                if(password >= 8){
                                    if(password == passwordConf){
                                        setCargando(true);

                                        let formData3 = new FormData();
                                                formData3.append('correo', correo);
                                                Axios({
                                                    method: 'post',
                                                    url: `${baseUrl}BackEnd/usuariocorreo`,
                                                    data: formData3,
                                                    headers: {'Content-Type': 'multipart/form-data'} 
                                                })
                                                .then(json3 => {
                                                    console.log(json3.data);
                                                    if(json3.data.resultado){
                            
                                                        Alert.alert('Correo ya existente', 'El correo ya ingresado ya está en uso...');
                                                        setCargando(false);
                                                        
                                                    } else {
                                                        let formData = new FormData();
                                                        formData.append('correo', correo);
                                                        formData.append('contrasenia', password);
                                                        formData.append('nombre', nombre);
                                                        formData.append('duenio', radio);
                                                        formData.append('telefono', telefono);
                                                        formData.append('direccion', `${calle} ${numero}`);
                                                        formData.append('comprobante', comprobante);
                                                        formData.append('subcolonia', selectedValue);
                                                        Axios({
                                                            method: 'post',
                                                            url: `${baseUrl}BackEnd/nuevousuario`,
                                                            data: formData,
                                                            headers: {'Content-Type': 'multipart/form-data'} 
                                                        })
                                                        .then(json => {
                                                            console.log(json.data);
                                                            setCargando(false);
                                                            if(json.data.resultado){

                                                                props.navigation.replace('Login');

                                                                } else {
                                                                    Alert.alert('Error', json.data.mensaje);
                                                                }
                                                        })
                                                        .catch((error) => {
                                                            console.log(error);
                                                            Alert.alert('ERROR', 'Ocurrió un error, por favor intenta nuevamente');
                                                            setCargando(false);
                                                        }
                                                        );
                                                    }
                                                })
                                                .catch((error) => {
                                                    console.log(error);
                                                    Alert.alert('ERROR', 'Ocurrió un error, por favor intenta nuevamente');
                                                    setCargando(false);
                                                }
                                                );
            
                                    } else {
                                        Alert.alert(
                                            'Contraseñas no coinciden',
                                            'Las contraseñas deben ser idénticas...'
                                        );  
                                    }
                                } else {
                                    Alert.alert(
                                        'Contraseña muy corta',
                                        'Su contraseña debe contener al menos 8 caracteres...'
                                    );
                                }
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
                                Registrarme
                            </Text>
                        </TouchableOpacity>
                    </View>
                    
                </View>
                </KeyboardAwareScrollView>
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
        width: '95%',
        height: 570,
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