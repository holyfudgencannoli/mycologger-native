import { useState, useCallback, useContext } from "react"
import { Surface,TextInput } from "react-native-paper";
import { StyleSheet, Text, View, ImageBackground, Button, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useEffect } from "react";
import { ScreenPrimative } from "@components/screen-primative";
import { ImageBG } from "@components/image-bg";
import CreateHardwareItem from "./purchase-log-form";
import { LinearGradient } from "expo-linear-gradient";
import * as Form from '@custom/react-native-forms/src'
import { useForm } from "react-hook-form";
import * as Item from '@db/items'
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { RootDrawerParamsList } from "@navigation/types";
import { useSQLiteContext } from "expo-sqlite";
import { FormStateContext } from "src/context/FormContext";
import { MyTabBar } from "@components/bottom-tabs";
import { tabs } from "./types";


type NavigationProps = DrawerNavigationProp<RootDrawerParamsList>


export default function NewItem({ navigation, state }) {
  const [items, setItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const { name, setName } = useContext(FormStateContext);
  const { category, setCategory } = useContext(FormStateContext);
  const { subcategory, setSubcategory } = useContext(FormStateContext);



  const db = useSQLiteContext();

  const { control, handleSubmit, formState: { errors }, } = useForm({
    defaultValues: {
      name: '',
      category: '',
      subcategory: ''
    },
  });

  const getData = async() => {
    const data = await Item.readAll(db)
    setItems(data)
  }

  useFocusEffect(
		useCallback(() => {
				
			return() => {
				setName('')
				setCategory('')
				setSubcategory('')
			}
		}, [])
	)


  const onSubmit = async() => {
    const nowMs = new Date().getTime()
    const TYPE = 'hardware_item'
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
    console.log("Consumable Supply Item Created. ID:", itemId)
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
              <Button color={'#f74a63cc'} title='Submit' onPress={handleSubmit(onSubmit)} />
            </View>
        </LinearGradient>	
      </View>
      <MyTabBar navigation={navigation} state={navigation.getState()} tabs={tabs} />
      
    </ScreenPrimative>
  )

}


const styles = StyleSheet.create({
    container: { flex: 1 }
});