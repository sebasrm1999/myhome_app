import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

export default function DescPago(props){
    props.navigation.setOptions({title: `${props.route.params.pago.mes} ${props.route.params.pago.anio}`});

    function pronto(){
        if(props.route.params.pago.pronto === '1'){
            return 'Sí';
        } else if(props.route.params.pago.pronto === '0'){
            return 'No';
        }
    }

    function verificado(){
        if(props.route.params.pago.verificado === '1'){
            return 'Sí';
        } else if(props.route.params.pago.verificado === '0'){
            return 'No';
        }
    }

    function tipo(){
        if(props.route.params.pago.tipo === '1'){
            return 'Tarjeta de crédito/débito';
        } else if(props.route.params.pago.tipo === '2'){
            return 'Paypal';
        } else if(props.route.params.pago.tipo === '3'){
            return 'OXXO';
        }
    }

    function status(){
        if(props.route.params.pago.status === '1' || props.route.params.pago.status === 1){
            return 'Pagado';
        } else if(props.route.params.pago.status === '0' || props.route.params.pago.status === 0){
            return 'Pendiente';
        }
    }

    function info(){
        if(props.route.params.pago.status === '1' || props.route.params.pago.status === 1){
            return <View>
                <Text style={{fontSize: 16, marginTop: 10, marginHorizontal: 10}}>{`Pronto Pago: ${pronto()}`}</Text>
                <Text style={{fontSize: 16, marginTop: 10, marginHorizontal: 10}}>{`Verificado: ${verificado()}`}</Text>
                <Text style={{fontSize: 16, marginTop: 10, marginHorizontal: 10}}>{`Tipo de pago: ${tipo()}`}</Text>
            </View>;
        } else if(props.route.params.pago.status === '0' || props.route.params.pago.status === 0){
            return <TouchableOpacity
            onPress={()=> props.navigation.navigate('ProcesoPago', {
                adeudo: 1,
                id: props.route.params.pago.id_pago,
                mes: props.route.params.pago.mes,
                anio: props.route.params.pago.anio
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
                    borderRadius: 5,
                    marginTop : 10
                }}>Pagar</Text>
            </TouchableOpacity>
        }
    }

    return(
        <View style={{flex: 1}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                <Text style={{fontSize: 16, margin: 10}}>{`Folio: ${props.route.params.pago.id_pago}`}</Text>
                <Text style={{fontSize: 16, margin: 10}}>{`Estado: ${status()}`}</Text>
            </View>
            
            <Text style={{fontSize: 16, marginHorizontal: 10, textAlign: 'right'}}>{`Fecha: ${props.route.params.pago.fecha}`}</Text>
            <Text style={{fontSize: 16, marginHorizontal: 10, textAlign: 'right'}}>{`Hora: ${props.route.params.pago.hora}`}</Text>
            <Text style={{fontSize: 16, marginHorizontal: 10}}>{`Nombre: ${props.route.params.pago.nombre}`}</Text>
            {info()}
        </View>
    );
}