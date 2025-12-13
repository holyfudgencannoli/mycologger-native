import { Alert, Platform, StyleSheet, View } from "react-native";
import { ImageBG } from "@components/image-bg";
import { ScreenPrimative } from "@components/screen-primative";
import CreateRecipeBatch from "./recipe-batch-form";
import { useState } from "react";
import { useNavigation, usePreventRemove } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@constants/colors";

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
      <ScreenPrimative edges={[]}>
        <View style={styles.container}>	
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0.3, y: 0.9 }}
            colors={COLORS.BACKGROUND_GRADIENT.PRIMARY}
            style={{ flex: 1, padding: 24}}
          >
            <CreateRecipeBatch setUnsaved={setUnsaved} />
          </LinearGradient>
        </View>
      </ScreenPrimative>
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
    padding: 8,
    backgroundColor: 'white',
    // margin: 8
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