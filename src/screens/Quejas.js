import React, { useState, useEffect } from 'react';
import { Text,View, RefreshControl, SafeAreaView } from 'react-native';
import { Alert, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Queja from '../components/Queja';
import { FontAwesome5 } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import {baseUrl} from '../libs/listas';
import Loader from '../components/Loader';
import Constants from 'expo-constants';
import Axios from 'axios';

export default function Quejas(props){
    const [cargando, setCargando] = useState(true);
    const [quejas, setQuejas] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    useEffect(() => {
		setCargando(true);
		
        getUserData();
    }, []);

    async function getUserData() {
        let id = await SecureStore.getItemAsync('id');
        let formData = new FormData();
        formData.append('id_usuario', id);
        Axios({
            method: 'post',
            url: `${baseUrl}BackEnd/quejaxusuario`,
            data: formData,
            headers: {'Content-Type': 'multipart/form-data'} 
        })
        .then(json => {
            if(json.data != null){
                setQuejas(json.data.quejas);
            }
            setCargando(false);
            setRefreshing(false);
        })
        .catch((error) => {
            console.log(error);
            Alert.alert('ERROR', 'Ocurrió un error inesperado, por favor intenta nuevamente');
            setCargando(false);
        }
        );
        
    }

    return cargando ? <Loader
    mensaje='Cargando, por favor espera...'/> : (
        <View style={{flex: 1}}>
            <SafeAreaView style={{marginTop: Constants.statusBarHeight, flex: 1}}>
            <ScrollView style={{flex: 1}}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={() => {
                    setRefreshing(true);
                    setCargando(true);
                    getUserData();
                }} />
                }
            >
            <View>
                {quejas != null ? quejas.map((item, index)=>{
                    return(
                        <Queja
                        key={index}
                        queja={item}
                        nav={props.navigation}
                        />
                    );
                }) : <View></View>}
            </View>
            
            </ScrollView>
            </SafeAreaView>
            
            <View style={{flex: 0.2, justifyContent: 'center', alignItems:'center'}}>
                <TouchableOpacity
                onPress={()=> props.navigation.navigate('NuevaQueja')}
                >
                    <Text style={{
                        backgroundColor: '#adc867',
                        padding: 15,
                        borderRadius: 10
                    }}>
                        <FontAwesome5 name='plus' size={35} color='#FFF'/>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
        
    );
}