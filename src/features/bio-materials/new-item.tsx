import { Button, StyleSheet, View } from 'react-native';
import * as Form from 'custom_modules/react-native-forms/src';
import { useCallback, useEffect, useState } from 'react';
import { Surface } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import * as InvItem from '@db/inventory-items'
import * as BioMat from '@db/bio-materials'
import * as InvLog from '@db/inventory-logs'

import { useSQLiteContext } from 'expo-sqlite';
import { LinearGradient } from 'expo-linear-gradient';
// import { useFocusEffect } from '@react-navigation/native';

export default function NewItem() {
	const [items, setItems] = useState([])
	const [selectedItem, setSelectedItem] = useState(null)
	const [category, setCategory] = useState('');
	const [speciesLatin, setSpeciesLatin] = useState('');



	const db = useSQLiteContext();

		const { control, handleSubmit, formState: { errors }, } = useForm({
			defaultValues: {
				name: '',
				category: '',
				speciesLatin: ''
			},
		});

	const getData = async() => {
		const data = await BioMat.readAll(db)
		setItems(data)
	}

	useEffect(() => {
		getData()
	}, [])

	const onSubmit = async() => {
		const nowMs = new Date().getTime()
		const TYPE = 'bio_material'
		const invItemId = await InvItem.create(db, TYPE, nowMs)
		const bioMatId = await BioMat.create(db, invItemId, selectedItem.name, category, speciesLatin)
		InvLog.create(db, TYPE, bioMatId, 0, 'Unit', nowMs)
	};

	return(
		<View style={{ flex: 1 }}>
			<LinearGradient
				start={{ x: 0, y: 0 }}
				end={{ x: 0.3, y: 0.9 }}
				colors={['#94F8', '#00f', '#057']}
                style={{ flex: 1, padding: 24}}
				
			>
				<Form.Control name='name' labelStyle={{ color: 'white' }}>
					<Form.Select 
						style={{ backgroundColor: 'transparent', flex: 1  }}
						options={items}
						selectedValue={selectedItem}
						onValueChange={setSelectedItem}
						placeholder='Select Item'
						size='lg'
					/>
				</Form.Control>
				<Form.Control label='Item Category' labelStyle={{ color: 'white' }} name='category'>
					<Form.Input size='lg' style={{ color: 'white', flex: 1 }} value={category} onChangeText={setCategory}  />
				</Form.Control>
				<Form.Control label='Species Name (Latin)' name='speciesLatin' labelStyle={{ color: 'white' }}>
					<Form.Input value={speciesLatin} style={{ color: 'white', flex: 1 }} onChangeText={setSpeciesLatin}  />
				</Form.Control>
				<Button title='Submit' onPress={() => handleSubmit(onSubmit)} />
			</LinearGradient>
		</View>
	)

}


const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" }
});