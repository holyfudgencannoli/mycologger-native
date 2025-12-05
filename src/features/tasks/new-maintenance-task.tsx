import { useCallback, useEffect, useState } from "react"
import { Surface,TextInput } from "react-native-paper";
import { StyleSheet, Text, Button } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTheme } from "../../hooks/useTheme";
import { View } from "react-native-reanimated/lib/typescript/Animated";
import * as Task from '@db/tasks'
import { SQLiteRunResult, useSQLiteContext } from "expo-sqlite";
import * as InvLog from '@db/inventory-logs'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TimePair } from "./new-task-form";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { RootDrawerParamsList } from "@navigation";


type NavigationProps = DrawerNavigationProp<RootDrawerParamsList>


export default function CreateMaintenanceTask({id}: {id: number}) {
    const db =  useSQLiteContext()
    const navigation = useNavigation<NavigationProps>();
    const [name, setName] = useState("")
    const [start, setStart] = useState("")
    const [end, setEnd] = useState("")    
    const [startMs, setStartMs] = useState<number>()
    const [endMs, setEndMs] = useState<number>()
    const [notes, setNotes] = useState("")
    const { theme } = useTheme()

    const STORAGE_KEY = "times";


    useFocusEffect(
        useCallback(() => {
            return () => {
                setName('');
                setNotes('')
            };
        }, [])
    );

    useEffect(() => {
      const loadTimes = async () => {
        try {
          const json = await AsyncStorage.getItem(STORAGE_KEY);
          console.log(json)
          if (json) {
            const [{...parsed}]: any = JSON.parse(json)
            console.log(parsed['startTime'])
            setStart(new Date(parsed['startTime']).toLocaleString())
            setEnd(new Date(parsed['endTime']).toLocaleString())
            setStartMs(new Date(parsed['startTime']).getTime())
            setEndMs(new Date(parsed['endTime']).getTime())
            
          }
        } catch (e) {
          console.warn("Failed to load times:", e);
        }
      };
      loadTimes();
    }, []);



    const handleSubmit = async () => {
        console.log(start)
        console.log(end)
        try {
            const taskId = await Task.create(db, name, startMs, endMs, notes)
            navigation.navigate("Dashboard")
            return taskId
        } catch (error) {
            console.error(error)
        }
    }


    return(
            <Surface style={styles.surfaceMetaContainer}>                        
                <Surface style={styles.surfaceContainer}>
                    <Text style={theme.formTitle}>New Maintenance Task</Text>        
                </Surface>
                <Surface style={styles.surfaceContainer}>
                    <Surface style={styles.surface}>
                        <TextInput
                            label="Task Name"
                            value={name}
                            onChangeText={setName}
                            mode="outlined"
                        />
                    </Surface>
                    <Surface style={styles.surface}>
                        <TextInput
                            label="Start Time"
                            value={start}
                            disabled
                            mode="outlined"
                        />
                    </Surface>
                    <Surface style={styles.surfaceBottom}>
                        <TextInput
                            label="End Time"
                            value={end}
                            disabled
                            mode="outlined"
                        />
                    </Surface>
                    <Surface style={styles.surface}>
                        <TextInput
                            label="Notes"
                            value={notes}
                            onChangeText={setNotes}
                            mode="outlined"
                        />
                    </Surface>
                    <Button  color={'#000000'} title="Submit" onPress={() => handleSubmit()} />

                </Surface>    
            </Surface>
    )

}


const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", },
  text: { fontSize: 20, marginBottom: 20 },
  form: {
    backgroundColor: 'rgba(0, 17, 255, 0.3)',
    width:66    
  },
  backgroundImage:{
    paddingBottom: 300
  },
  input: {
    // margin: 8,
    // padding: 8,
    // gap: 16,
    fontSize: 16
  },
  surface: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    // marginBottom: 8
  },
  surfaceBottom: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginBottom: 24
  },
  surfaceContainer: {
    padding: 16,
    backgroundColor: 'rgba(56,185,255,0.3)'
  },
  surfaceMetaContainer: {
    backgroundColor: 'rgba(55,255,55,0.4)',
    width:350,
    margin: 'auto',
    marginTop: 16,
  },
  title: {
    fontSize: 24,
    textAlign:  'center',
    fontWeight: 'bold',
    color: 'red',
    textShadowColor: 'blue',
    textShadowRadius: 16,
  },
  subtitle: {
    fontSize: 18,
    textAlign:  'center',
    fontWeight: 'bold',
    color: 'red',
    textShadowColor: 'blue',
    textShadowRadius: 16,
  },
measurementBox: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8, // space between inputs (RN 0.71+)
  paddingHorizontal: 8,
},

measurementInput: {
  flex: 1,          // take equal space
  minWidth: 120,    // never smaller than 120px
  maxWidth: 180,    // optional: never bigger than 180px
},

   measurementContainer: {
    display: 'flex',
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
  },
  item: {
    width: "30%",        // 3 items per row
    aspectRatio: 1,      // makes it square
    marginBottom: 10,
    backgroundColor: "#4682B4",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  measurementText: {
    color: "white",
    fontWeight: "bold",
  },
  measurementFloatInput: {
    width: 144
  }
});