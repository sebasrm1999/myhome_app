import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Aviso(props){
    return(
        <View style={estilos.container}>
            <TouchableOpacity
            onPress={()=>{
                Alert.alert(
                    `${props.aviso.asunto}`,
                    `${props.aviso.descripcion}`
                );
            }
            }
            style={{flex: 1, flexDirection:'row'}}>
                <View style={{flex: 2, justifyContent: 'center', alignItems: 'center', marginTop: 5}}>
                    <Text style={props.aviso.status == 0 ? estilos.tituloSinLeer : estilos.tituloLeido}>{props.aviso.asunto}</Text>
                </View>
                <View style={{flex: 2, justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                    <Text style={{
                        fontSize: 12
                    }}>{props.aviso.fecha}</Text>
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
    },
    tituloLeido: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'gray'
    }
});