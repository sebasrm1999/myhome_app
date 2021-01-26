import React, { useState, useEffect } from 'react';
import { Alert, Text, View, StyleSheet, Picker, RefreshControl, SafeAreaView } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Pago from '../components/Pago';
import * as SecureStore from 'expo-secure-store';
import {baseUrl} from '../libs/listas';
import Loader from '../components/Loader';
import Constants from 'expo-constants';
import Axios from 'axios';

const wait = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

export default function Pagos(props){

    const [mes,setMes] = useState('Septiembre');
    const [idPago,setIdpago] = useState(null);
    const [estado,setEstado] = useState(0);
    const [selectedValue, setSelectedValue] = useState('fechadesc');
    const [cargando, setCargando] = useState(true);
    const [pagos, setPagos] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    

    useEffect(() => {
		setCargando(true);
		pagoanterior();
        getUserData();
        cargarTabla();
    }, []);

    async function getUserData() {
        let id = await SecureStore.getItemAsync('id');
        const nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        const fecha = new Date();
        let formData = new FormData();
        formData.append('id_usuario', id);
        formData.append('mes', nombresMeses[fecha.getMonth()]);
        formData.append('anio', fecha.getFullYear());
        Axios({
            method: 'post',
            url: `${baseUrl}BackEnd/pagoactual`,
            data: formData,
            headers: {'Content-Type': 'multipart/form-data'} 
        })
        .then(json => {
            setMes(nombresMeses[fecha.getMonth()]);
            setEstado(json.data != null ? 1 : 0);
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

    async function pagoanterior(){

        let id = await SecureStore.getItemAsync('id');
        const nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];
    
        const fecha = new Date();
    
        let mes2 = fecha.getMonth();
        let anio = fecha.getFullYear();
        let mesBusca = mes2-1;
        if(mes2 == 0){
            mesBusca = 11;
            anio = anio-1;
        }
        let formData = new FormData();
        formData.append('id_usuario', id);
        formData.append('mes', nombresMeses[mesBusca]);
        formData.append('anio', anio);
        Axios({
            method: 'post',
            url: `${baseUrl}BackEnd/pagoactual`,
            data: formData,
            headers: {'Content-Type': 'multipart/form-data'} 
        })
        .then(json => {
            if(json.data == null){
                let formData2 = new FormData();
                formData2.append('id_usuario', id);
                formData2.append('mes', nombresMeses[mesBusca]);
                formData2.append('anio', anio);
                Axios({
                    method: 'post',
                    url: `${baseUrl}BackEnd/nuevopago`,
                    data: formData2,
                    headers: {'Content-Type': 'multipart/form-data'} 
                })
                .then(json2 => {
                    Alert.alert('¡Ojo!', 'El mes anterior se ha agregado como pago pendiente.');
                    cargarTabla();
                })
                .catch((error) => {
                    console.log(error);
                    Alert.alert('ERROR', 'Ocurrió un error inesperado, por favor intenta nuevamente');
                    setCargando(false);
                }
                );
            }
        })
        .catch((error) => {
            console.log(error);
            Alert.alert('ERROR', 'Ocurrió un error inesperado, por favor intenta nuevamente');
            setCargando(false);
        }
        );
    
    }
    
    async function cargarTabla(){
        let id = await SecureStore.getItemAsync('id');
        let formData = new FormData();
        formData.append('id_usuario', id);
        Axios({
            method: 'post',
            url: `${baseUrl}BackEnd/pagosxusuario`,
            data: formData,
            headers: {'Content-Type': 'multipart/form-data'} 
        })
        .then(json => {
            if(json.data != null){
                console.log(json.data);
                setPagos(json.data.pagos);
            }
            
            
        })
        .catch((error) => {
            console.log(error);
            Alert.alert('ERROR', 'Ocurrió un error inesperado, por favor intenta nuevamente');
            setCargando(false);
        }
        );
    }

    function botonPagar(){
        if(estado === '0' || estado === 0){
            return <TouchableOpacity
            onPress={()=> props.navigation.navigate('ProcesoPago', {
                adeudo: 0
            })}
            >
                <Text style={{
                    backgroundColor: '#adc867',
                    color: '#FFF',
                    padding: 5,
                    marginHorizontal: 15,
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    borderRadius: 5
                }}>Pagar</Text>
            </TouchableOpacity>
        } else {
            return <TouchableOpacity
            onPress={()=> props.navigation.navigate('ProcesoPago', {
                adeudo: 2
            })}
            >
                <Text style={{
                    backgroundColor: '#adc867',
                    color: '#FFF',
                    padding: 5,
                    marginHorizontal: 15,
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    borderRadius: 5
                }}>Pagar siguiente mes por adelantado</Text>
            </TouchableOpacity>
        }
    }

    function status(){
        if(estado === '0' || estado === 0){
            return 'Pendiente'
        } else if(estado === '1' || estado === 1){
            return 'Pagado'
        }
    }

    return cargando ? <Loader
    mensaje='Cargando, por favor espera...'/> : (
        <SafeAreaView style={{marginTop: Constants.statusBarHeight, flex: 1}}>
            <ScrollView style={{flex: 1}}
        refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => {
            setRefreshing(true);
            setCargando(true);
            pagoanterior();
            getUserData();
            cargarTabla();
        }} />
        }>
            <View style={{flex: 1, flexDirection: 'row', margin: 15, justifyContent: 'space-around'}}>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>{`Mes: ${mes}`}</Text>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>{`Estado: ${status()}`}</Text>
            </View>
            {botonPagar()}
            <Text style={{fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginTop: 10,}}>Pagos anteriores</Text>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <Text style={{textAlign: 'center', marginTop: 15}}>Ordenar por: </Text>
                <Picker
                selectedValue={selectedValue}
                style={{ height: 50, width: 150, marginHorizontal: 15, padding: 5 }}
                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                >
                    <Picker.Item label="Más reciente" value="fechadesc" />
                    <Picker.Item label="Menos reciente" value="fechaasc" />
                </Picker>
            </View>
            <View style={{flex: 3}}>
                {pagos != null ? pagos.sort((a,b)=>{
                    if(selectedValue === 'fechadesc'){
                        return a.fecha < b.fecha ? 1 : -1;
                    } else if(selectedValue === 'fechaasc'){
                        return a.fecha > b.fecha ? 1 : -1;
                    } 
                })
                .map((item, index)=>{
                    return(
                        <Pago
                        key={index}
                        pago={item}
                        nav={props.navigation}
                        />
                    );
                }) : <View></View>}
            </View>
        </ScrollView>
        </SafeAreaView>
    );
}

const estilos = StyleSheet.create({

});