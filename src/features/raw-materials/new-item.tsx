import { StyleSheet, View } from 'react-native';
import * as Form from 'custom_modules/react-native-forms/src';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Item from '@db/items'
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootDrawerParamsList } from '@navigation/types';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenPrimative } from '@components/screen-primative';
import Button from '@components/button';
import { FormStateContext } from 'src/context/FormContext';
import { MyTabBar } from '@components/bottom-tabs';
import { tabs } from './types/raw-material';
import { COLORS } from '@constants/colors';
// import { useFocusEffect } from '@react-navigation/native';

type NavigationProps = DrawerNavigationProp<RootDrawerParamsList>

export default function NewItem({ navigation }) {
	const [items, setItems] = useState([])
	const { 
		name, setName,
		category, setCategory,
		subcategory, setSubcategory } = useContext(FormStateContext);



	const db = useSQLiteContext();

	// const { control, handleSubmit, formState: { errors }, } = useForm({
	// 	defaultValues: {
	// 		name: '',
	// 		category: '',
	// 		subcategory: ''
	// 	},
	// });

	const getData = async() => {
		const data = await Item.readAll(db)
		console.log(data)
		setItems(data)
	}

	useFocusEffect(
		useCallback(() => {
			getData()
			return() => {
				setName('')
				setCategory('')
				setSubcategory('')
			}
		}, [])
	)

	const onSubmit = async() => {
		const nowMs = new Date().getTime()
		const TYPE = 'raw_material'
		const itemId = await Item
		.create(
			db, 
			name, 
			category, 
			subcategory, 
			TYPE, 
			nowMs, 
			null, 
			null, 
			null, 
			nowMs, 
			null, 
			null 
		)
		console.log("Raw Material Created. ID:", itemId)
		navigation.navigate("Dashboard")
	};

	return(
		<ScreenPrimative edges={[]}>
			<View style={styles.container}>	
				<LinearGradient
					start={{ x: 0, y: 0 }}
					end={{ x: 0.3, y: 0.9 }}
					colors={COLORS.BACKGROUND_GRADIENT.PRIMARY}
					style={{ flex: 1, padding: 24}}
				>
					<Form.Control label='Item Name' labelStyle={{ color: 'white' }} name='name'>
						<Form.Input size='lg' style={{ color: 'white', flex: 1 }} value={name} onChangeText={setName}  />
					</Form.Control>
					<Form.Control label='Item Category' labelStyle={{ color: 'white' }} name='category'>
						<Form.Input size='lg' style={{ color: 'white', flex: 1 }} value={category} onChangeText={setCategory}  />
					</Form.Control>
					<Form.Control label='Item Subcategory' labelStyle={{ color: 'white' }} name='subcategory'>
						<Form.Input size='lg' value={subcategory} style={{ color: 'white', flex: 1 }} onChangeText={setSubcategory}  />
					</Form.Control>
					<Button viewStyle={{ marginTop: 36 }} color={'#f74a63cc'} title='Submit' onPress={() => onSubmit()} />
				</LinearGradient>	
				<MyTabBar navigation={navigation} state={navigation.getState()} tabs={tabs} />

			</View>
		</ScreenPrimative>
		
	)

}


const styles = StyleSheet.create({
    container: { flex: 1 }
});