import { Alert, Platform, StyleSheet, View } from "react-native";
import { ImageBG } from "@components/image-bg";
import { ScreenPrimative } from "@components/screen-primative";
import CreateRecipeBatch from "./recipe-batch-form";
import { useState } from "react";
import { useNavigation, usePreventRemove } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@constants/colors";
import { ScrollView } from "react-native-gesture-handler";
import { CONTAINER } from "@constants/styles";

export default function ExecuteRecipeBatch() {    
    const [unsaved, setUnsaved] = useState(false)
    const navigation = useNavigation();
    

    usePreventRemove(unsaved, ({ data }) => {
        if (Platform.OS === 'web') {
            const discard = confirm(
                'You have unsaved changes. Discard them and leave the screen?'
            );

            if (discard) {
                navigation.dispatch(data.action);
            }
        } else {
            Alert.alert(
                'Discard changes?',
                'You have unsaved changes. Discard them and leave the screen?',
                [
                    { text: "Don't leave", style: 'cancel', onPress: () => {} },
                    {
                        text: 'Discard',
                        style: 'destructive',
                        onPress: () => navigation.dispatch(data.action),
                    },
                ]
            );
        }
    });



    return(
        <View style={styles.container}>
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 0.3, y: 0.9 }}
                colors={COLORS.BACKGROUND_GRADIENT.PRIMARY}
                style={{ ...CONTAINER.FULL, padding: 24 }}
            >
                <ScreenPrimative edges={[]}>
                    <CreateRecipeBatch setUnsaved={setUnsaved} />
                </ScreenPrimative>
            </LinearGradient>
        </View>
    )
}



const styles = StyleSheet.create({
  container: { flex: 1 },
});