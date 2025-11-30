import React, { ReactNode } from "react";
import { ImageBackground, ImageSourcePropType, StyleSheet } from "react-native";

type BGProps = {
    children: ReactNode;
    image: ImageSourcePropType;
};

export const ImageBG: React.FC<BGProps> = ({
    children,
    image
}) => {
    
    return(
        <ImageBackground
            source={image}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            {children}
        </ImageBackground>
    )
}


const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1, // Make the background image fill the entire screen
    justifyContent: 'center',
    alignItems: 'center',
  }
});