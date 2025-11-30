import { Button, StyleSheet } from 'react-native';
import * as Form from 'custom_modules/react-native-forms/src';
import { useCallback, useEffect, useState } from 'react';
import { Surface } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import * as InvItem from '@db/inventory-items'
import * as RawMat from '@db/raw-materials'
import * as InvLog from '@db/inventory-logs'

import { useSQLiteContext } from 'expo-sqlite';
// import { useFocusEffect } from '@react-navigation/native';

export default function NewItem() {
	const [items, setItems] = useState([])
	const [selectedItem, setSelectedItem] = useState(null)
	const [category, setCategory] = useState('');
	const [subcategory, setSubcategory] = useState('');



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

	useEffect(
		useCallback(() => {
			getData()
		}, [])
	)

	const onSubmit = async() => {
		const nowMs = new Date().getTime()
		const TYPE = 'raw_material'
		const invItemId = await InvItem.create(db, TYPE, nowMs)
		const rawMatId = await RawMat.create(db, invItemId, selectedItem.name, category, subcategory)
		InvLog.create(db, TYPE, rawMatId, 0, 'Unit', nowMs)
	};

	return(
		<Surface style={{ backgroundColor: 'rgba( 160, 160, 160, 0.3)',  padding: 24 }}>
			<Form.Control name='name' >
				<Form.Select 
					style={{ backgroundColor: 'white' }}
					options={items}
					selectedValue={selectedItem}
					onValueChange={setSelectedItem}
					placeholder='Select Item'
					size='lg'
				/>
			</Form.Control>
			<Form.Control label='Item Category' labelStyle={{ color: 'grey' }} name='category'>
				<Form.Input size='lg'style={{ color: 'green' }} value={category} onChangeText={setCategory}  />
			</Form.Control>
			<Form.Control label='Item Subcategory' name='subcategory'>
				<Form.Input value={subcategory} onChangeText={setSubcategory}  />
			</Form.Control>
			<Button title='Submit' onPress={() => handleSubmit(onSubmit)} />
		</Surface>
	)

}


const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" }
});