// src/components/ReceiptUploader.tsx
import React, { useState } from 'react';
import {
  View,
  Button,
  Image,
  StyleSheet,
  Alert,
  FlatList,
  Text,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { saveReceiptLocally, loadAllReceipts, ReceiptMeta } from '@services/local-receipt';

export const ReceiptUploader: React.FC = () => {
  const [receipts, setReceipts] = useState<ReceiptMeta[]>([]);
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  // Load existing receipts on mount
  React.useEffect(() => {
    loadAllReceipts().then(setReceipts);
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8, // optional
      });

      if (!result.canceled) {
        setPreviewUri(result.assets[0].uri);
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Could not open image library.');
    }
  };

  const handleSave = async () => {
    if (!previewUri) return;

    try {
      const meta = await saveReceiptLocally(previewUri);
      setReceipts(prev => [...prev, meta]);
      setPreviewUri(null);
      Alert.alert('Success', 'Receipt saved locally.');
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Could not save receipt.');
    }
  };

  const renderItem = ({ item }: { item: ReceiptMeta }) => (
    <View style={styles.item}>
      <Image source={{ uri: `file://${item.filePath}` }} style={styles.thumb} />
      <Text>{item.name}</Text>
      <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Pick & preview */}
      <Button title="Pick a receipt" onPress={pickImage} />
      {previewUri && (
        <>
          <Image source={{ uri: previewUri }} style={styles.preview} />
          <Button title="Save locally" onPress={handleSave} />
        </>
      )}

      {/* List of saved receipts */}
      <FlatList
        data={receipts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  preview: { width: '100%', height: 200, marginVertical: 12 },
  list: { marginTop: 24 },
  item: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  thumb: { width: 60, height: 60, marginRight: 12, borderRadius: 4 },
  date: { fontSize: 10, color: '#666' },
});
