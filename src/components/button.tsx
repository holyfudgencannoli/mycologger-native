import React from "react";
import { ColorValue, FlexStyle, View, ViewStyle } from "react-native";
import { Button as ButtonBase } from "react-native";

export default function Button({
    title, 
    onPress, 
    viewStyle, 
    color
}: {
    title: string,
    onPress: () => void, 
    viewStyle?: FlexStyle | ViewStyle, 
    color?: ColorValue
}){
    return(
        <View
            style={viewStyle}
        >
            <ButtonBase 
                color={color}
                title={title}
                onPress={onPress}
            />
        </View>
    )

}