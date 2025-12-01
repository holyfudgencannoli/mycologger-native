import { LinearGradient } from "expo-linear-gradient";
import { Button, View } from "react-native";
import { Surface, Text, TouchableRipple } from "react-native-paper";

export default function Header({ title, style, textStyle, navigation }) {
    return(
        <TouchableRipple underlayColor="white" rippleColor='rgba(0,0,0,0.3)' onPress={() => navigation.toggleDrawer()}>
            <View style={{...style, display: 'flex', flexDirection: 'row'}}>
                <Text style={textStyle}>
                    {title}
                </Text>
            </View>
        </TouchableRipple>
    )
    
}