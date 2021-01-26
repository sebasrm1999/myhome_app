import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Queja(props){
    function status(){
        if(props.queja.status === '1'){
            return 'Recibido'
        } else if(props.queja.status === '2'){
            return 'Leído'
        } else if(props.queja.status === '3'){
            return 'Respondido'
        } else if(props.queja.status === '4'){
            return 'Cerrada'
        }
    }
    return(
        <View style={estilos.container}>
            <TouchableOpacity
            onPress={()=>props.nav.navigate('DescQueja', {
                queja: props.queja
            })
            }
            style={{flex: 1, flexDirection:'row'}}>
                <View style={{flex: 2, justifyContent: 'center', alignItems: 'flex-start', marginTop: 5}}>
                    <Text style={estilos.tituloSinLeer}>{props.queja.asunto}</Text>
                    <Text style={{marginTop: 5, fontStyle: 'italic'}}>{props.queja.area}</Text>
                    <Text style={{
                        fontSize: 12
                    }}>Publicada: {props.queja.fecha}</Text>
                </View>
                <View style={{flex: 2, justifyContent: 'space-around', alignItems: 'flex-end'}}>
                    <Text style={{
                        backgroundColor: props.queja.status === '4' ? '#FF0000' : '#067d26',
                        color: '#FFF',
                        borderRadius: 15,
                        padding: 5,
                        paddingHorizontal: 20
                    }}>{
                        status()
                    }</Text>
                    
                    <Text style={{
                        fontSize: 12
                    }}>Resolución estimada: {props.queja.fecha_estimada}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const estilos = StyleSheet.create({
    container : {
        flex: 1,
        margin: 15,
        borderWidth: 0.1,
        shadowColor: '#adc867',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        padding: 20
    },
    tituloSinLeer: {
        fontWeight: 'bold',
        fontSize: 16,
    }
});