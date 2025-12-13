import { useState, useEffect, useCallback, useContext } from 'react';
import { Image, View, StyleSheet, Alert, Switch, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '@constants/colors';
import Button from './button';
import { FormStateContext } from 'src/context/FormContext';

export default function ImageSelector() {
  const [cropEnabled, setCropEnabled] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [libraryPermission, setLibraryPermission] = useState<boolean | null>(null);


    const {image, setImage, setContentType} = useContext(FormStateContext)

  useEffect(() => {
    (async () => {
      const camPerm = await ImagePicker.getCameraPermissionsAsync();
      if (!camPerm.granted) {
        const requestCam = await ImagePicker.requestCameraPermissionsAsync();
        setCameraPermission(requestCam.granted);
      } else {
        setCameraPermission(true);
      }

      const libPerm = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (!libPerm.granted) {
        const requestLib = await ImagePicker.requestMediaLibraryPermissionsAsync();
        setLibraryPermission(requestLib.granted);
      } else {
        setLibraryPermission(true);
      }
    })();
  }, []);

  const pickImageFromLibrary = async () => {
    if (!libraryPermission) {
      Alert.alert('Permission denied', 'Cannot access media library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: cropEnabled,
      aspect: cropEnabled ? [4, 3] : undefined,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      setContentType(result.assets[0].mimeType)
      console.log(result.assets[0].mimeType)
    }
  };

  const takePhotoWithCamera = async () => {
    if (!cameraPermission) {
      Alert.alert('Permission denied', 'Cannot access camera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: cropEnabled,
      aspect: cropEnabled ? [4, 3] : undefined,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        <Text
          style={{ color: 'white', fontSize: 18, margin: 24, justifyContent: 'space-evenly' }}
        >
          Enable Cropping:
        </Text>
        <Switch 
          value={cropEnabled} 
          onValueChange={setCropEnabled} 
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button 
          color={COLORS.button.primary} 
          title="Pick an image from library" 
          onPress={pickImageFromLibrary} 
        />
        <Button 
          color={COLORS.button.primary} 
          title="Take a photo with camera" 
          onPress={takePhotoWithCamera} 
        />
      </View>
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    gap: 60,
    // alignItems: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 36
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});
