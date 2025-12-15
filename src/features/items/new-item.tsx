import { useState, useCallback, useContext, JSX } from "react"
import { StyleSheet, View, Button, Alert } from 'react-native';
import { RouteProp, useFocusEffect, useRoute, useRoutePath } from '@react-navigation/native';
import { ScreenPrimative } from "@components/screen-primative";
import { LinearGradient } from "expo-linear-gradient";
import * as Form from '@custom/react-native-forms/src'
import * as Item from '@db/items'
import { InventoryItemParamList } from "@navigation/types";
import { useSQLiteContext } from "expo-sqlite";
import { FormStateContext } from "src/context/FormContext";
import { MyTabBar } from "@components/bottom-tabs";
import { tabs } from "./types";
import { COLORS } from "@constants/colors";
import { CaseHelper } from "@utils/case-helper";
import { CONTAINER } from "@constants/styles";

type NavigationProps = RouteProp<InventoryItemParamList, 'New Item'>

export default function NewItem({ navigation, state }): JSX.Element {
  const [items, setItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const path = useRoutePath(); 
  const { params } = useRoute<NavigationProps>();
  const { msg, msg2 } = params;

  const { name, setName,
    category, setCategory,
    subcategory, setSubcategory } = useContext(FormStateContext);
  

  const db = useSQLiteContext();

  useFocusEffect(
    useCallback(() => {
    }, [])
  )

  
    async function getItems(type: string) {
      const data = await Item.getAllByType(
        db,
        type
      )
      setItems(data)

    }



  useFocusEffect(
		useCallback(() => {
      const TYPE = CaseHelper.toSnakeCase(decodeURIComponent(path.split('/')[2])).slice(0, -1)
      console.log(TYPE)
      console.log(msg)
      console.log(msg2)
      getItems(TYPE)
      
			return() => {
				setName('')
				setCategory('')
				setSubcategory('')
			}
		}, [])
	)

  const onSubmit = async() => {
    const itemNames: string[] = items.map((item) => item.name)
    if (itemNames.includes(name)) {
      Alert.alert("Duplicate Item Creation", "Item Already Exists!")
    } else {
      const nowMs = new Date().getTime()
      const TYPE = CaseHelper.toSnakeCase(decodeURIComponent(path.split('/')[2])).slice(0, -1)
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
      console.log(`${CaseHelper.toCleanCase(TYPE)} Created. ID: `, itemId)
      navigation.navigate("Dashboard")
    }
  };

  return(
    <ScreenPrimative edges={[]}>
      <View style={CONTAINER.FULL}>	
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0.3, y: 0.9 }}
          colors={COLORS.BACKGROUND_GRADIENT.PRIMARY}
          style={{ ...CONTAINER.FULL, padding: 24}}
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
              <Button color={'#f74a63cc'} title='Submit' onPress={onSubmit} />
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