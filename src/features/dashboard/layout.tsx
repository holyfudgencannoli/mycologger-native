import { StyleSheet, Text, View } from "react-native";
import { ScreenPrimative } from "@components/screen-primative";
import { LinearGradient } from 'expo-linear-gradient'
import { Surface } from "react-native-paper";
// import * as MediaLibrary from 'expo-media-library'
import { Platform } from "react-native";


export default function Dashboard() {
  

  // async function requestFilePermissions() {
  //   if (Platform.OS === 'android') {
  //     const { status } = await MediaLibrary.requestPermissionsAsync();
  //     if (status !== 'granted') {
  //       throw new Error('Permission to access storage is required.');
  //     }
  //   }
  // }


	return(
		<ScreenPrimative edges={[]}>
			<View style={styles.container}>
        <LinearGradient 
          start={{ x: 0, y: 0 }}
          end={{ x: 0.3, y: 0.9 }}
          colors={['#94F8', '#00f', '#057']}
          style={{ flex: 1 }}
        >
          <View style={{ padding: 48 }}>

          </View>
        </LinearGradient>  
			</View>
		</ScreenPrimative>      
	)
    
}


const styles = StyleSheet.create({
  container: { flex: 1 },
});
