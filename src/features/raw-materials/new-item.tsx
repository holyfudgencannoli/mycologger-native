import { Button, StyleSheet, View } from 'react-native';
import * as Form from 'custom_modules/react-native-forms/src';
import { useCallback, useEffect, useState } from 'react';
import { Surface } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import * as InvItem from '@db/inventory-items'
import * as RawMat from '@db/raw-materials'
import * as InvLog from '@db/inventory-logs'

import { useSQLiteContext } from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';
import { RootDrawerParamsList } from '@navigation';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenPrimative } from '@components/screen-primative';
// import { useFocusEffect } from '@react-navigation/native';

type NavigationProps = DrawerNavigationProp<RootDrawerParamsList>

export default function NewItem() {
	const [items, setItems] = useState([])
	const [selectedItem, setSelectedItem] = useState(null)
	const [name, setName] = useState('');
	const [category, setCategory] = useState('');
	const [subcategory, setSubcategory] = useState('');
	const navigation = useNavigation<NavigationProps>()



	const db = useSQLiteContext();

	const { control, handleSubmit, formState: { errors }, } = useForm({
		defaultValues: {
			name: '',
			category: '',
			subcategory: ''
		},
	});

	const getData = async() => {
		const data = await RawMat.readAll(db)
		setItems(data)
	}

	useEffect(() => {
		getData()
	}, [])

	const onSubmit = async() => {
		const nowMs = new Date().getTime()
		const TYPE = 'raw_material'
		const invItemId = await InvItem.create(db, TYPE, nowMs)
		const rawMatId = await RawMat.create(db, invItemId, selectedItem.name, category, subcategory)
		InvLog.create(db, TYPE, rawMatId, 0, 'Unit', nowMs)
		navigation.navigate("Dashboard")
	};

	return(
		<ScreenPrimative edges={[]}>
			<View style={styles.container}>	
				<LinearGradient
					start={{ x: 0, y: 0 }}
					end={{ x: 0.3, y: 0.9 }}
					colors={['#94F8', '#00f', '#057']}
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
						<View style={{ marginTop: 36 }}>
							<Button color={'#f74a63cc'} title='Submit' onPress={() => handleSubmit(onSubmit)} />
						</View>
				</LinearGradient>	
			</View>
		</ScreenPrimative>
		
	)

}


const styles = StyleSheet.create({
    container: { flex: 1 }
});