import React,{ useState, useEffect } from 'react';
import { Alert, Text, View, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { FontAwesome5 } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import {baseUrl} from '../libs/listas';
import Loader from '../components/Loader';
import Axios from 'axios';

export default function Ayuda(){
    const [cargando, setCargando] = useState(true);
    const [preguntas, setPreguntas] = useState(null);

    useEffect(() => {
		async function getUserData() {
			Axios({
				method: 'get',
				url: `${baseUrl}BackEnd/preguntas`,
				headers: {'Content-Type': 'multipart/form-data'} 
			})
			.then(json => {
                if(json.data != null){
                    setPreguntas(json.data.preguntas);
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

    return cargando ? <Loader
    mensaje='Cargando, por favor espera...'/> : (
        <ScrollView style={{flex: 1}}>
            <View style={{ alignItems: 'center'}}>
                <Text style={{
                    marginTop: 10,
                    fontWeight: 'bold', 
                    fontSize: 20 
                }}>Preguntas frecuentes</Text>
                {preguntas != null ? preguntas.map((item, index)=>{
                    return <View style={estilos.container} key={index}>
                        <Text style={{
                            fontWeight: 'bold',
                            fontSize: 18,
                            marginBottom: 5
                        }}>{item.asunto}</Text>
                        <Text style={{fontSize: 16}}>{item.descripcion}</Text>
                    </View>
                }) : <View></View>}
            </View>
            <View style={{backgroundColor: '#067d26', alignItems: 'center'}}>
                <Text style={{color: '#FFF', fontWeight: 'bold', fontSize: 20, marginTop: 10}}>Contáctanos</Text>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                    <FontAwesome5 name='whatsapp' size={22} color='#FFF'/>
                    <Text style={{color: '#FFF', fontSize: 18, marginLeft: 5}}>4611099218</Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                    <FontAwesome5 name='at' size={22} color='#FFF'/>
                    <Text style={{color: '#FFF', fontSize: 18, marginLeft: 5}}>sebastian.ramed@gmail.com</Text>
                </View>
                <View style={{flexDirection: 'row', marginVertical: 10}}>
                    <FontAwesome5 name='facebook' size={22} color='#FFF'/>
                    <Text style={{color: '#FFF', fontSize: 18, marginLeft: 5}}>myHome</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        padding: 20
    }
});