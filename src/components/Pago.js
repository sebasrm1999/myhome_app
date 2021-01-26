import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Pago(props){
    function status(){
        if(props.pago.status === '0' || props.pago.status === 0){
            return 'Pendiente'
        } else if(props.pago.status === '1' || props.pago.status === 1){
            return 'Pagado'
        } 
    }
    return(
        <View style={estilos.container}>
            <TouchableOpacity
            onPress={()=>props.nav.navigate('DescPago', {
                pago: props.pago
            })
            }
            style={{flex: 1, flexDirection:'row'}}>
                <View style={{flex: 2, justifyContent: 'center', alignItems: 'flex-start', marginTop: 5}}>
                    <Text style={estilos.tituloSinLeer}>{`${props.pago.mes}`}</Text>
                    <Text style={{marginTop: 5, fontStyle: 'italic'}}>{props.pago.anio}</Text>
                </View>
                <View style={{flex: 2, justifyContent: 'center', alignItems: 'flex-start', marginTop: 5}}>
                    <Text style={{marginTop: 5, fontStyle: 'italic'}}>{props.pago.status == '0' ? '---' : `${props.pago.fecha}`}</Text>
                    <Text style={{marginTop: 5, fontStyle: 'italic'}}>{props.pago.status == '0' ? '---' : `${props.pago.hora}`}</Text>
                </View>
                <View style={{flex: 2, justifyContent: 'space-around', alignItems: 'flex-end'}}>
                    <Text style={{
                        backgroundColor: props.pago.status == '0' ? '#FF0000' : '#067d26',
                        color: '#FFF',
                        borderRadius: 15,
                        padding: 5,
                        paddingHorizontal: 20
                    }}>{
                        status()
                    }</Text>
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