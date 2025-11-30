import { StyleSheet, Text, View } from "react-native";
import { ScreenPrimative } from "@components/screen-primative";

export default function Dashboard() {

	return(
		<ScreenPrimative>
			<View style={styles.container}>
				<Text>Dashboard</Text>           
			</View>
		</ScreenPrimative>      
	)
    
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },

  button:{
    color: 'black'
  },
  reactLogo: {
    height: 360,
    width: 420,
    bottom: 0,
    left: -10,
    position: 'absolute',
    alignItems: 'center'
  },
  listTitle:{
    textAlign:'center',
    fontWeight:'bold',
    fontSize: 28,
    padding: 36,

    
  },
  list: {
    // padding:32
  },
  listItem: {
    fontSize: 24,

    margin: 8
  },
  taskRow: {
    backgroundColor: '#fff',
    flexDirection: 'cloumn',
    alignItems: 'center',
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  }
});
