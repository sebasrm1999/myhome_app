import React, { useState, useEffect } from 'react';
import { Alert, Text, View, Picker, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import {baseUrl} from '../libs/listas';
import Loader from '../components/Loader';
import Axios from 'axios';

export default function NuevaQueja(props){

    const [selectedValue, setSelectedValue] = useState('1');
    const [cargando, setCargando] = useState(true);
    const [areas, setAreas] = useState(null);
    const [asunto, setAsunto] = useState('');
    const [descripcion, setDescripcion] = useState('');

    useEffect(() => {
		setCargando(true);
		async function getUserData() {
			Axios({
				method: 'post',
				url: `${baseUrl}BackEnd/areas`,
				headers: {'Content-Type': 'multipart/form-data'} 
			})
			.then(json => {
                if(json.data != null){
                    setAreas(json.data.areas);
                    setSelectedValue(json.data.areas[0].id_area);
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

    async function publicar(){
        if(asunto.length > 0 && descripcion.length > 0){
            setCargando(true);
            let id = await SecureStore.getItemAsync('id');
            let formData = new FormData();
            formData.append('id_usuario', id);
            formData.append('id_area', selectedValue);
            formData.append('asunto', asunto);
            formData.append('descripcion', descripcion);
            Axios({
                method: 'post',
                url: `${baseUrl}BackEnd/nuevaqueja`,
                data: formData,
                headers: {'Content-Type': 'multipart/form-data'} 
            })
            .then(json => {
                if(json.data.resultado){
                    props.navigation.replace('Inicio');
                }
            })
            .catch((error) => {
                console.log(error);
                Alert.alert('ERROR', 'Ocurrió un error inesperado, por favor intenta nuevamente');
                setCargando(false);
            }
            );
        } else {
            Alert.alert('Alto!', 'Favor de llenar todos los campos...');
        }
        
    }

    return cargando ? <Loader
    mensaje='Cargando, por favor espera...'/> : (
        <View style={{flex: 1}}>
            <Text style={estilos.subtitle}>Asunto</Text>
            <TextInput
            style={estilos.input}
            keyboardType='default'
            placeholder='Escriba aquí...'
            onChange={val => setAsunto(val.nativeEvent.text)}
            />
            <Text style={estilos.subtitle}>Área a la que va dirigida la queja</Text>
            <Picker
                selectedValue={selectedValue}
                style={{ height: 50, width: '90%', marginHorizontal: 15, padding: 5 }}
                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
            >
                {areas != null ? areas.map((item, index) => {
                    return(
                        <Picker.Item key={index} label={item.nombre} value={item.id_area} />
                    );
                }) : <View></View>}
            </Picker>
            <Text style={estilos.subtitle}>Descripción de Queja</Text>
            <TextInput
            style={estilos.input}
            keyboardType='default'
            multiline = {true}
            numberOfLines = {8}
            placeholder='Escriba aquí...'
            onChange={val => setDescripcion(val.nativeEvent.text)}
            />
            <TouchableOpacity
            onPress={()=>publicar()}
            >
                <Text
                style={estilos.boton}
                >
                    Confirmar
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const estilos = StyleSheet.create({
    subtitle: {
        fontWeight: 'bold',
        margin: 15,
        fontSize: 16
    },
    input: {
        marginHorizontal: 15,
        width:'90%',
        borderWidth: 1,
        borderColor: '#adc867',
        padding: 5
    },
    boton:{
        backgroundColor: '#adc867',
        padding: 5,
        borderRadius: 5,
        color: '#FFF',
        fontSize: 20,
        margin: 15,
        textAlign: 'center'
    }
});