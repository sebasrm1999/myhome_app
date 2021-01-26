import React, { useEffect, useState } from 'react';
import { ImageBackground, Text, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Alert, ScrollView, FlatList } from 'react-native-gesture-handler';
import {
	createDrawerNavigator,
	DrawerItemList,
} from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import {
	SimpleLineIcons,
	FontAwesome5,
} from '@expo/vector-icons';
import Aviso from '../components/Aviso';
import Quejas from './Quejas';
import Pagos from './Pagos';
import Ayuda from './Ayuda';
import * as SecureStore from 'expo-secure-store';
import {baseUrl} from '../libs/listas';
import Loader from '../components/Loader';
import Axios from 'axios';

const pantalla = Dimensions.get('screen');

const Drawer = createDrawerNavigator();

const DrawerContent = (props) => (
	<ScrollView>
		<View
			style={{
				backgroundColor: '#adc867',
				height: 100,
				marginBottom: 15,
				alignItems: 'center',
				justifyContent: 'space-around',
			}}
		>
			<TouchableOpacity
			onPress={()=> {
				SecureStore.deleteItemAsync('id');
				SecureStore.deleteItemAsync('nombre');
				SecureStore.deleteItemAsync('email');
				props.navigation.replace('Login');
			}}
			>
				<Text
				style={{
					backgroundColor: '#067d26',
					color: '#FFF',
					padding: 10,
					borderRadius: 10,
					fontWeight: 'bold',
					fontSize: 16
				}}
				>
					Cerrar sesión
				</Text>
			</TouchableOpacity>
		</View>
		{/*Indicamos los items del navigatorDrawer (Drawer.Screen)*/}
		<DrawerItemList {...props} />
	</ScrollView>
);

export default function Inicio(props){
    props.navigation.setOptions({
        headerLeft: () => (
            <SimpleLineIcons
                name='menu'
                size={25}
                color='#adc867'
                style={{ padding: 10 }}
                onPress={() =>
                    props.navigation.dispatch(
                        DrawerActions.toggleDrawer()
                    )
                }
            />
        ),
    });
    return(
        <Drawer.Navigator
        drawerContentOptions={{
            activeTintColor: '#067d26'
        }}
        drawerContent={DrawerContent}>
				<Drawer.Screen
					name='Avisos'
                    component={Avisos}
					options={{
						drawerIcon: () => (
							<FontAwesome5
								name='home'
								size={20}
								color='#adc867'
							/>
						),
					}}
				/>
				<Drawer.Screen
					name='Quejas'
                    component={Quejas}
					options={{
						drawerIcon: () => (
							<FontAwesome5
								name='hand-paper'
								size={20}
								color='#adc867'
							/>
						),
					}}
				/>
				<Drawer.Screen
					name='Pagos'
                    component={Pagos}
					options={{
						drawerIcon: () => (
							<FontAwesome5
								name='money-bill-alt'
								size={20}
								color='#adc867'
							/>
						),
					}}
				/>
				<Drawer.Screen
					name='Ayuda'
                    component={Ayuda}
					options={{
						drawerIcon: () => (
							<FontAwesome5
								name='question-circle'
								size={20}
								color='#adc867'
							/>
						),
					}}
				/>
			</Drawer.Navigator>
    );
}

export function Avisos(props){
	const [cargando, setCargando] = useState(true);
	const [avisos, setAvisos] = useState(null);
	const [personales, setPersonales] = useState(null);
	useEffect(() => {
		setCargando(true);
		async function getUserData() {
			Axios({
				method: 'get',
				url: `${baseUrl}BackEnd/avisos`,
				headers: {'Content-Type': 'multipart/form-data'} 
			})
			.then(json => {
				console.log(json.data.avisos);
				setAvisos(json.data.avisos);
			})
			.catch((error) => {
				console.log(error);
				Alert.alert('ERROR', 'Ocurrió un error inesperado, por favor intenta nuevamente');
				setCargando(false);
			}
			);
			let id = await SecureStore.getItemAsync('id');
			console.log(id);
			let formData = new FormData();
			formData.append('id_usuario', id);
			Axios({
				method: 'post',
				url: `${baseUrl}BackEnd/avisopersonal`,
				data: formData,
				headers: {'Content-Type': 'multipart/form-data'} 
			})
			.then(json => {
				setPersonales(json.data.avisos);
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
            <Text style={estilos.title}>Avisos Generales</Text>
			<ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={250}
                decelerationRate='fast'
				pagingEnabled={true}
                >
					{avisos != null ? avisos.map((item, index) => {
						
						if(item.tipo == 1 ){
							return <View id={item.id_aviso} key={index} style={estilos.avisoContainer}>
							<ImageBackground source={require('../../assets/images/index.jpg')} style={estilos.backgroundImage}>
							<View style={estilos.container}>
								<Text style={{fontWeight: 'bold', fontSize: 22}}>{item.asunto}</Text>
								<Text style={{marginTop: 10}}>{item.descripcion}</Text>
							</View>
							</ImageBackground>
						</View>
						}
						
					}) : <View style={estilos.avisoContainer}>
					<ImageBackground source={require('../../assets/images/index.jpg')} style={estilos.backgroundImage}>
					<View style={estilos.container}>
						<FontAwesome5 name="home" size={50} color='#adc867'/>
						
					</View>
					</ImageBackground>
				</View>}

                </ScrollView>
				<Text style={estilos.personalesTitulo}>Avisos Personales</Text>
				<View>
					{personales != null ? personales.map((aviso, index)=>{
						return(
							<Aviso
							key={index}
							aviso={aviso}
							nav={props.navigation}
							/>
						);
					}) : <View></View>}
				</View>
        </ScrollView>
    );
}

const estilos = StyleSheet.create({
	title : {
		backgroundColor: '#adc867',
		color: '#FFF',
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center',
		width: '100%'
	},
	avisoContainer: {
		width: pantalla.width,
		height: 400,
		alignItems: 'center'
	},
	backgroundImage: {
		width: 400,
		  height: 300,
		  resizeMode: 'cover',
		  justifyContent: 'center',
		  alignItems: 'center'
	  },
	  container : {
        backgroundColor: '#FFF',
        opacity: 0.9,
        width: '80%',
        height: '85%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 4
	},
	personalesTitulo: {
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center',
		width: '100%', 
		marginBottom: 15
	}
});