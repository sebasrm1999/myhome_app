import React, { useState, useRef,useEffect } from 'react';
import { Alert, Text, View, ScrollView, StyleSheet, TextInput, KeyboardAvoidingView, Keyboard } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesome5 } from '@expo/vector-icons';
import KeyboardListener from 'react-native-keyboard-listener';
import * as SecureStore from 'expo-secure-store';
import {baseUrl} from '../libs/listas';
import Loader from '../components/Loader';
import Axios from 'axios';

export default function DescQueja(props){
    props.navigation.setOptions({title: `${props.route.params.queja.asunto}`});

    const [cargando, setCargando] = useState(true);
    const [comentarios, setComentarios] = useState(null);
    const [queja, setQueja] = useState(null);
    const [texto, setTexto] = useState('');
    const [tamaño, setTamaño] = useState(35);
    const keyboardShowListener = useRef(null);
    const keyboardHideListener = useRef(null);

    async function getUserData() {
        let formData = new FormData();
        formData.append('id', props.route.params.queja.id_queja);
        Axios({
            method: 'post',
            url: `${baseUrl}BackEnd/comentariosxqueja`,
            data: formData,
            headers: {'Content-Type': 'multipart/form-data'} 
        })
        .then(json => {
            setQueja(json.data.queja);
            setComentarios(json.data.comentarios);
            setCargando(false);
            console.log(json.data.queja);
        })
        .catch((error) => {
            console.log(error);
            Alert.alert('ERROR', 'Ocurrió un error inesperado, por favor intenta nuevamente');
            setCargando(false);
        }
        );
        
    }

    useEffect(() => {
        keyboardShowListener.current = Keyboard.addListener('keyboardDidShow', () => setTamaño(18));
        keyboardHideListener.current = Keyboard.addListener('keyboardDidHide', () => setTamaño(35));
    
        return () => {
          keyboardShowListener.current.remove();
          keyboardHideListener.current.remove();
        }
      })

      useEffect(() => {
		setCargando(true);
		
        getUserData();
    }, []);

    async function comentar(){
        if(texto.length > 0){
            setCargando(true);
            let id = await SecureStore.getItemAsync('id');
            let formData = new FormData();
            formData.append('id_usuario', id);
            formData.append('texto', texto);
            formData.append('id_queja', props.route.params.queja.id_queja);
            Axios({
                method: 'post',
                url: `${baseUrl}BackEnd/nuevocomentario`,
                data: formData,
                headers: {'Content-Type': 'multipart/form-data'} 
            })
            .then(json => {
                if(json.data.resultado){
                    getUserData();
                }
                setCargando(false);
                
            })
            .catch((error) => {
                console.log(error);
                Alert.alert('ERROR', 'Ocurrió un error inesperado, por favor intenta nuevamente');
                setCargando(false);
            }
            );
        } else {
            Alert.alert('Alto!', 'Favor de introducir el comentario...');
        }
        
    }

    return cargando ? <Loader
    mensaje='Cargando, por favor espera...'/> : (
        <View  style={{flex:1}}>
            <ScrollView style={{flex:1}}>

                <Text style={estilos.usuario}>{queja != null ? queja[0].nombre : ''}</Text>
                <View style={estilos.queja}>
                    <Text>{queja != null ? queja[0].descripcion : ''}</Text>
                </View>
                <Text style={{alignSelf: 'flex-end', margin: 10, marginRight: 20}}>{queja != null ? queja[0].fecha : ''} {queja != null ? queja[0].hora : ''}</Text>
                <Text style={{marginLeft: 20, color: 'gray', fontSize: 14}}>Comentarios:</Text>
                <View style={{marginLeft: 50}}>
                {comentarios != null ? comentarios.map((item, index)=>{
                    return(
                    <View key={index}>
                        <Text style={estilos.usuario}>{item.nombre}</Text>
                        <View style={estilos.queja}>
                            <Text>{item.texto}</Text>
                        </View>
                        <Text style={{alignSelf: 'flex-end', marginTop: 10, marginRight: 20}}>{item.fecha} {item.hora}</Text>
                    </View>
                    );
                }) : <View></View>}
                </View>
            </ScrollView>
            <KeyboardAvoidingView style={{flex: 0.1, flexDirection: 'row'}}>
                <TextInput
                style={estilos.input}
                placeholder='Ingrese un comentario...'
                keyboardType='default'
                onChange={val => setTexto(val.nativeEvent.text)}
                />
                <TouchableOpacity onPress={() => comentar()}>
                    <Text style={{
                        backgroundColor: '#067d26',
                        color: '#FFF',
                        padding: 5,
                        borderRadius: 5,
                        alignSelf: 'center',
                        height: '90%',
                        paddingHorizontal: 8
                    }}>
                        <FontAwesome5 name='comment' size={tamaño} color='#FFF'/>
                    </Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
        
    );
}

const estilos = StyleSheet.create({
    usuario: {
        fontWeight: 'bold',
        fontSize: 16, 
        margin: 20
    },
    queja: {
        borderWidth: 0.5,
        borderColor: '#adc867',
        borderRadius: 5,
        padding: 15,
        marginHorizontal: 20
    },
    input: {
        borderBottomWidth: 2,
        borderBottomColor: '#067d26',
        width : '80%',
        height: '90%',
        marginHorizontal: 10,
    }
});