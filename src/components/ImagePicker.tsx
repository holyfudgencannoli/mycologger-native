import { useState, useEffect, useCallback } from 'react';
import { Button, Image, View, StyleSheet, Alert, Switch, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';

export default function ImagePickerExample({image, setImage, contentType, setContentType}) {
  const [cropEnabled, setCropEnabled] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [libraryPermission, setLibraryPermission] = useState<boolean | null>(null);


    

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
    <>
      <View style={styles.switchContainer}>
        <Text>Enable Cropping:</Text>
        <Switch value={cropEnabled} onValueChange={setCropEnabled} />
      </View>

      <Button color={'#000000'} title="Pick an image from library" onPress={pickImageFromLibrary} />
      <View style={{ height: 10 }} />
      <Button color={'#000000'} title="Take a photo with camera" onPress={takePhotoWithCamera} />

      {image && <Image source={{ uri: image }} style={styles.image} />}
    </>
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
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});
