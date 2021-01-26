import React, { useState, useEffect } from 'react';
import { Alert, Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { FontAwesome5 } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import {baseUrl} from '../libs/listas';
import Loader from '../components/Loader';
import Axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

export default function ProcesoPago(props){

    const [tarjeta, setTarjeta] = useState(false);
    const [oxxo, setOxxo] = useState(false);
    const [imagenbanco,setImagenbanco] = useState('');
    const [numero,setNumero] = useState('');
    const [clabe,setClabe] = useState('');
    const [costo,setCosto] = useState('');
    const [dias,setDias] = useState('');
    const [fecha,setFecha] = useState('');
    const [comprobante, setComprobante] = useState('');
    const [costoPronto,setCostoPronto] = useState('');
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
		setCargando(true);
        datos();
    }, []);

    function datos(){
        Axios({
            method: 'get',
            url: `${baseUrl}BackEnd/datos`,
            headers: {'Content-Type': 'multipart/form-data'} 
        })
        .then(json => {
            if(json.data != null){
                if(esEntero(json.data.datos[0].costo)){
                    setCosto(json.data.datos[0].costo+'.00');
                } else {
                    setCosto(json.data.datos[0].costo+'0');
                }
    
                if(esEntero(json.data.datos[0].costo_pronto)){
                    setCostoPronto(json.data.datos[0].costo_pronto+'.00');
                } else {
                    setCostoPronto(json.data.datos[0].costo_pronto+'0');
                }

                var today = new Date();
                var date=today.getDate();
                setFecha(date);
                
                if(json.data.datos[0].banco == 'bancomer'){
                    setImagenbanco(require(`../../assets/images/bancomer.png`));
                } else if(json.data.datos[0].banco == 'banamex'){
                    setImagenbanco(require(`../../assets/images/banamex.png`));
                } else if(json.data.datos[0].banco == 'hsbc'){
                    setImagenbanco(require(`../../assets/images/hsbc.png`));
                } else if(json.data.datos[0].banco == 'santander'){
                    setImagenbanco(require(`../../assets/images/santander.png`));
                }
                setNumero(json.data.datos[0].numero);
                setClabe(json.data.datos[0].clabe);
                setDias(json.data.datos[0].dias);
                setCargando(false);
            }
            
        })
        .catch((error) => {
            console.log(error);
            Alert.alert('ERROR', 'Ocurrió un error inesperado, por favor intenta nuevamente');
            setCargando(false);
        }
        );
    }

    function esEntero(numero){
        if (numero - Math.floor(numero) == 0) {
            return true;
        } else {
            return false;
        }
    }

    async function tomarDocumento(){
        let result = await DocumentPicker.getDocumentAsync({});
            result.type = 'image/jpeg'
          console.log(result);
          setComprobante(result);
    }

    function info(){
        if(tarjeta){
            return(
                <View>
                    <Text style={{textAlign: 'center', fontSize: 24, fontWeight: 'bold', marginVertical: 10}}>Transferir a cuenta: </Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                        <Image source={imagenbanco} style={{height: 70, width: 70}}/>
                        <View style={{ justifyContent: 'space-around'}}>
                            <Text style={estilos.subtitle}>Número de tarjeta: {numero}</Text>
                            <Text style={estilos.subtitle}>CLABE: {clabe}</Text>
                        </View>
                    </View>
                    <View style={{justifyContent: 'space-around', flexDirection: 'row'}}>
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
                                padding: 10,
                                marginTop: 10,
                                borderRadius: 5
                            }}
                            >Subir comprobante</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={async () => {
                                const permisoCamara = await Permissions.askAsync(Permissions.CAMERA);
                                if (permisoCamara.status === 'granted') {
                                    try {
                                        let imagenCamara = await ImagePicker.launchCameraAsync({
                                            allowsEditing: true,
                                            aspect: [4, 3],
                                            quality: 1
                                        });
                                        if (imagenCamara.cancelled === false) {
                                            let filename = imagenCamara.uri.split('/').pop();
                                            let match = /\.(\w+)$/.exec(filename);
                                            let type = match ? `image/${match[1]}` : `image`
                                            setComprobante({ type: type, uri: imagenCamara.uri, name: filename })
                                        }
                                    }
                                    catch (e) {
                                        console.log(e);
                                    }
                                }
                            }}
                        >
                            <View
                            style={{
                                backgroundColor: '#067d26',
                                padding: 10,
                                marginTop: 10,
                                borderRadius: 5,
                                flexDirection: 'row',
                                justifyContent : 'space-around'
                            }}
                            >
                                <FontAwesome5 color='#FFF' name='camera' size={25}/>
                                <Text style={{color: '#FFF',
                                fontWeight: 'bold', marginLeft: 5}}>Tomar Foto</Text>
                            </View>
                        
                        </TouchableOpacity>
                    </View>
                    <View style={{justifyContent: 'center', alignItems : 'center'}}>
                        {comprobante != '' ? <Image
                        source={{ uri: comprobante.uri }}
                        style={
                            {   
                                marginTop: 10,
                                alignSelf : 'center',
                                width: 200,
                                height: 200,
                                resizeMode: 'cover',
                                backgroundColor: '#ffff'
                            }
                        }/> : <View></View>}
                    </View>
                    <View style={{justifyContent: 'center', alignItems : 'center'}}>
                        <TouchableOpacity
                        onPress={() => {
                            if(props.route.params.adeudo == 0){
                                pagonuevo(1);
                            } else if(props.route.params.adeudo == 1){
                                subirComprobante(props.route.params.id, 1);
                            } else if(props.route.params.adeudo == 2){
                                pagoadelantado(1);
                            }
                        }}
                        >
                            <Text style={{
                                backgroundColor: '#adc867',
                                color: '#FFF',
                                padding: 10,
                                marginHorizontal: 15,
                                fontSize: 16,
                                fontWeight: 'bold',
                                textAlign: 'center',
                                borderRadius: 5,
                                marginTop: 10 
                            }}>Pagar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        } else if(oxxo){
            return(
                <View>
                    <Text style={{textAlign: 'center', fontSize: 24, fontWeight: 'bold', marginVertical: 10}}>Depósitar a cuenta: </Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                        <Image source={imagenbanco} style={{height: 70, width: 70}}/>
                        <View style={{ justifyContent: 'space-around'}}>
                            <Text style={estilos.subtitle}>Número de tarjeta: {numero}</Text>
                            <Text style={estilos.subtitle}>CLABE: {clabe}</Text>
                        </View>
                    </View>
                    <View style={{justifyContent: 'space-around', flexDirection: 'row'}}>
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
                                padding: 10,
                                marginTop: 10,
                                borderRadius: 5
                            }}
                            >Subir comprobante</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={async () => {
                                const permisoCamara = await Permissions.askAsync(Permissions.CAMERA);
                                if (permisoCamara.status === 'granted') {
                                    try {
                                        let imagenCamara = await ImagePicker.launchCameraAsync({
                                            allowsEditing: true,
                                            aspect: [4, 3],
                                            quality: 1
                                        });
                                        if (imagenCamara.cancelled === false) {
                                            let filename = imagenCamara.uri.split('/').pop();
                                            let match = /\.(\w+)$/.exec(filename);
                                            let type = match ? `image/${match[1]}` : `image`
                                            setComprobante({ type: type, uri: imagenCamara.uri, name: filename })
                                        }
                                    }
                                    catch (e) {
                                        console.log(e);
                                    }
                                }
                            }}
                        >
                            <View
                            style={{
                                backgroundColor: '#067d26',
                                padding: 10,
                                marginTop: 10,
                                borderRadius: 5,
                                flexDirection: 'row',
                                justifyContent : 'space-around'
                            }}
                            >
                                <FontAwesome5 color='#FFF' name='camera' size={25}/>
                                <Text style={{color: '#FFF',
                                fontWeight: 'bold', marginLeft: 5}}>Tomar Foto</Text>
                            </View>
                        
                        </TouchableOpacity>
                    </View>
                    <View style={{justifyContent: 'center', alignItems : 'center'}}>
                        {comprobante != '' ? <Image
                        source={{ uri: comprobante.uri }}
                        style={
                            {   
                                marginTop: 10,
                                alignSelf : 'center',
                                width: 200,
                                height: 200,
                                resizeMode: 'cover',
                                backgroundColor: '#ffff'
                            }
                        }/> : <View></View>}
                    </View>
                    <View style={{justifyContent: 'center', alignItems : 'center'}}>
                        <TouchableOpacity
                        onPress={() => {
                            if(props.route.params.adeudo == 0){
                                pagonuevo(3);
                            } else if(props.route.params.adeudo == 1){
                                subirComprobante(props.route.params.id, 3);
                            } else if(props.route.params.adeudo == 2){
                                pagoadelantado(3);
                            }
                        }}
                        >
                            <Text style={{
                                backgroundColor: '#adc867',
                                color: '#FFF',
                                padding: 10,
                                marginHorizontal: 15,
                                fontSize: 16,
                                fontWeight: 'bold',
                                textAlign: 'center',
                                borderRadius: 5,
                                marginTop: 10 
                            }}>Pagar</Text>
                        </TouchableOpacity>
                    </View>
                    
                </View>
            );
        }
    }

    async function pagonuevo(tipo){
        let id = await SecureStore.getItemAsync('id');
        const nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        const fecha = new Date();

        let mes = fecha.getMonth();
        let anio = fecha.getFullYear();
        if(comprobante != ''){
            setCargando(true);
            let formData = new FormData();
            formData.append('id_usuario', id);
            formData.append('mes', nombresMeses[mes]);
            formData.append('anio', anio);
            Axios({
                method: 'post',
                url: `${baseUrl}BackEnd/nuevopago`,
                data: formData,
                headers: {'Content-Type': 'multipart/form-data'} 
            })
            .then(json => {
                if(json.data.resultado){
                    subirComprobante(json.data.id, tipo);
                }
                
            })
            .catch((error) => {
                console.log(error);
                Alert.alert('ERROR', 'Ocurrió un error inesperado, por favor intenta nuevamente');
                setCargando(false);
            }
            );
        } else {
            Alert.alert('Alto!', 'Aún no ha subido ningún comprobante.');
        }
    }

    async function pagoadelantado(tipo){
        let id = await SecureStore.getItemAsync('id');
        const nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];
            
        if(comprobante != ''){
            setCargando(true);
            let formData = new FormData();
            formData.append('id_usuario', id);
            Axios({
                method: 'post',
                url: `${baseUrl}BackEnd/pagosxusuario`,
                data: formData,
                headers: {'Content-Type': 'multipart/form-data'} 
            })
            .then(json => {
                let mesBusca = 0;
                let anioBusca = 0;

                json.data.pagos.map(doc => {
                    if(anioBusca == doc.anio){
                        if(doc.mes == 'Enero'){
                            if(mesBusca < 1){
                                mesBusca = 1;
                            }
                        } else if(doc.mes == 'Febrero'){
                            if(mesBusca < 2){
                                mesBusca = 2;
                            }
                        } else if(doc.mes == 'Marzo'){
                            if(mesBusca < 3){
                                mesBusca = 3;
                            }
                        } else if(doc.mes == 'Abril'){
                            if(mesBusca < 4){
                                mesBusca = 4;
                            }
                        } else if(doc.mes == 'Mayo'){
                            if(mesBusca < 5){
                                mesBusca = 5;
                            }
                        } else if(doc.mes == 'Junio'){
                            if(mesBusca < 6){
                                mesBusca = 6;
                            }
                        } else if(doc.mes == 'Julio'){
                            if(mesBusca < 7){
                                mesBusca = 7;
                            }
                        } else if(doc.mes == 'Agosto'){
                            if(mesBusca < 8){
                                mesBusca = 8;
                            }
                        } else if(doc.mes == 'Septiembre'){
                            if(mesBusca < 9){
                                mesBusca = 9;
                            }
                        } else if(doc.mes == 'Octubre'){
                            if(mesBusca < 10){
                                mesBusca = 10;
                            }
                        } else if(doc.mes == 'Noviembre'){
                            if(mesBusca < 11){
                                mesBusca = 11;
                            }
                        } else if(doc.mes == 'Diciembre'){
                            if(mesBusca < 12){
                                mesBusca = 12;
                            }
                        }
                    } else if(anioBusca < doc.anio){
                        anioBusca = doc.anio;
                        mesBusca = 0;
                        if(doc.mes == 'Enero'){
                            if(mesBusca < 1){
                                mesBusca = 1;
                            }
                        } else if(doc.mes == 'Febrero'){
                            if(mesBusca < 2){
                                mesBusca = 2;
                            }
                        } else if(doc.mes == 'Marzo'){
                            if(mesBusca < 3){
                                mesBusca = 3;
                            }
                        } else if(doc.mes == 'Abril'){
                            if(mesBusca < 4){
                                mesBusca = 4;
                            }
                        } else if(doc.mes == 'Mayo'){
                            if(mesBusca < 5){
                                mesBusca = 5;
                            }
                        } else if(doc.mes == 'Junio'){
                            if(mesBusca < 6){
                                mesBusca = 6;
                            }
                        } else if(doc.mes == 'Julio'){
                            if(mesBusca < 7){
                                mesBusca = 7;
                            }
                        } else if(doc.mes == 'Agosto'){
                            if(mesBusca < 8){
                                mesBusca = 8;
                            }
                        } else if(doc.mes == 'Septiembre'){
                            if(mesBusca < 9){
                                mesBusca = 9;
                            }
                        } else if(doc.mes == 'Octubre'){
                            if(mesBusca < 10){
                                mesBusca = 10;
                            }
                        } else if(doc.mes == 'Noviembre'){
                            if(mesBusca < 11){
                                mesBusca = 11;
                            }
                        } else if(doc.mes == 'Diciembre'){
                            if(mesBusca < 12){
                                mesBusca = 12;
                            }
                        }
                    }
                });
                if(mesBusca == 12){
					mesBusca = 0;
					anioBusca++;
                }
                let formData2 = new FormData();
                formData2.append('id_usuario', id);
                formData2.append('mes', nombresMeses[mesBusca]);
                formData2.append('anio', anioBusca);
                Axios({
                    method: 'post',
                    url: `${baseUrl}BackEnd/nuevopago`,
                    data: formData2,
                    headers: {'Content-Type': 'multipart/form-data'} 
                })
                .then(json => {
                    if(json.data.resultado){
                        subirComprobante(json.data.id, tipo);
                    }
                
            })
            .catch((error) => {
                console.log(error);
                Alert.alert('ERROR', 'Ocurrió un error inesperado, por favor intenta nuevamente');
                setCargando(false);
            }
            );
                
            })
            .catch((error) => {
                console.log(error);
                Alert.alert('ERROR', 'Ocurrió un error inesperado, por favor intenta nuevamente');
                setCargando(false);
            }
            );
        } else {
            Alert.alert('Alto!', 'Aún no ha subido ningún comprobante');
        }
        
    }

    async function subirComprobante(id, tipo){
        let idUsuario = await SecureStore.getItemAsync('id');

        let pronto = 0;
        console.log(fecha);
        console.log(dias);

        if(props.route.params.adeudo == 0){
            pronto = fecha <= dias ? 1 : 0;   
        } else if(props.route.params.adeudo == 2){
            pronto = 1;   
        }
	
        const nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        let mes = '';
        let anio = '';

        if(props.route.params.adeudo == 1){
            mes = props.route.params.mes;
            anio = props.route.params.anio;
        } else {
            const fecha2 = new Date();

            mes = fecha2.getMonth();
            anio = fecha2.getFullYear();
        }
        
        if(comprobante != ''){

        } else {
            Alert.alert('Alto!', 'Aún no ha subido ningún comprobante');
        }

        var formData = new FormData();
		formData.append('id', id);
		formData.append('id_usuario', idUsuario);
		formData.append('mes', props.route.params.adeudo == 1 ? mes : nombresMeses[mes]);
		formData.append('anio', anio);
		formData.append('pronto', pronto);
		formData.append('tipo', tipo);
		formData.append('comprobante', comprobante);

		Axios({
			method: 'post',
			url: `${baseUrl}BackEnd/subirticket`,
			headers: { 'Content-Type': 'multipart/form-data' },
			data: formData,
		}).then(json => {
			console.log(json);
			if (json.data.resultado) {
				if(props.route.params.adeudo == 0 || props.route.params.adeudo == 2){
					fechapago();
				} else {

					props.navigation.replace('Inicio');
					
				}
			}

			else {
                Alert.alert('Error', `${json.data.mensaje}`);
                setCargando(false);
			}
		}).catch(e => {
            Alert.alert('Error', `${e}`);
            console.log(e);
            setCargando(false);
		});
    }

    async function fechapago(){
        let idUsuario = await SecureStore.getItemAsync('id');
    
        let formData = new FormData();
        formData.append('id', idUsuario);
        Axios({
            method: 'post',
            url: `${baseUrl}BackEnd/fechausuario`,
            data: formData,
            headers: {'Content-Type': 'multipart/form-data'} 
        })
        .then(json => {
            if(json.data.resultado){
                props.navigation.replace('Inicio');
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

    function pagar(tipo) {
        setCargando(true);
        let id = props.route.params.id;
        let formData = new FormData();
        formData.append('id', id);
        formData.append('tipo', tipo);
        console.log(id);
        Axios({
            method: 'post',
            url: `${baseUrl}BackEnd/pagar`,
            data: formData,
            headers: {'Content-Type': 'multipart/form-data'} 
        })
        .then(json => {
            console.log(json.data);
            if(json.data.resultado){
                props.navigation.replace('Inicio')
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

    function total(){
        let total = '';
        if(props.route.params.adeudo == 0){
            if(fecha <= dias){
                total = costoPronto;
            } else {
                total = costo;
            }
        } else if(props.route.params.adeudo == 1){
            total = costo;
        } else if(props.route.params.adeudo == 2){
            total = costoPronto;
        }
        return total;
    }

    return cargando ? <Loader
    mensaje='Cargando, por favor espera...'/> : (
        <ScrollView style={{flex: 1}}>
            <Text style={{margin: 15, fontSize: 20, fontWeight:'bold'}}>Total a pagar: $ {total()}</Text>
            <Text style={{margin: 15, fontSize: 20, fontWeight:'bold'}}>Escoja un método de pago: </Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                <TouchableOpacity
                onPress={()=>{
                    if(tarjeta){
                        setTarjeta(false);
                    } else {
                        setTarjeta(true);
                        setOxxo(false);
                    }
                }}
                >
                    <Text style={{
                        backgroundColor: '#adc867',
                        padding: 10,
                        borderRadius: 10
                    }}>
                        <FontAwesome5 name='credit-card' size={30} color='#FFF'/>
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={()=>{
                    if(oxxo){
                        setOxxo(false);
                    } else {
                        setOxxo(true);
                        setTarjeta(false);
                    }
                }}
                style={{
                    backgroundColor: '#adc867',
                    padding: 10,
                    borderRadius: 10,
                    paddingHorizontal: 15
                }}
                >
                    <Image source={require('../../assets/images/oxxo_logo.png')} style={{height: 30, width: 70}}/>
                </TouchableOpacity>
            </View>
                {info()}
        </ScrollView>
    );
}

const estilos = StyleSheet.create({
    input: {
        marginHorizontal: 15,
        width:'90%',
        borderWidth: 1,
        borderColor: '#adc867',
        padding: 5
    },
    subtitle: {
        fontWeight: 'bold',
        fontSize: 14
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