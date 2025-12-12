import { Image, StyleSheet, Text, View } from "react-native";
import { ScreenPrimative } from "@components/screen-primative";
import { LinearGradient } from 'expo-linear-gradient'
import { Surface } from "react-native-paper";
import { Platform } from "react-native";
import GalleryScreen from "@features/raw-materials/receipt-gallery";


export default function Dashboard({ navigation }) {
  


	return(
		<ScreenPrimative edges={[]}>
			<View style={styles.container}>
        <LinearGradient 
          start={{ x: 0, y: 0 }}
          end={{ x: 0.3, y: 0.9 }}
          colors={['#94F8', '#00f', '#057']}
          style={{ flex: 1 }}
        >
            <GalleryScreen navigation={navigation} />
        </LinearGradient>  
			</View>
		</ScreenPrimative>      
	)
    
}


const styles = StyleSheet.create({
  container: { flex: 1 },
});
