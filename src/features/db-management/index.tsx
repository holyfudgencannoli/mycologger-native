import { useCallback, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import Button from '@components/button';
import { ScreenPrimative } from "@components/screen-primative";

// FIXED: Import the official hook from expo-sqlite, NOT from your own file
import { useSQLiteContext } from "expo-sqlite";

import * as XLSQL from '@utils/database-utils';
import * as Form from '@custom/react-native-forms/src';
import * as FileSystem from 'expo-file-system/legacy';
import { LinearGradient } from "expo-linear-gradient";

export default function DBManagement() {
  const db = useSQLiteContext();                    // CORRECT: Hook called inside component
  const [lastBackupUri, setLastBackupUri] = useState('');
  const [files, setFiles] = useState<string[]>([]); // Start empty, not ['']

  // FIXED: Actually invoke the async function
  useFocusEffect(
    useCallback(() => {
      listSandbox(); // or: void listSandbox(); if you prefer
    }, [])
  );

  async function deleteFile(filename: string) {
    try {
      const fileUri = FileSystem.documentDirectory + filename;
      await FileSystem.deleteAsync(fileUri, { idempotent: true });
      setFiles(prev => prev.filter(f => f !== filename)); // instantly update UI
      console.log("Deleted:", filename);
    } catch (err) {
      console.error("Error deleting file:", filename, err);
    }
  }

  const handleDelete = (filename: string) => {
    Alert.alert(
      "Delete backup file",
      `Are you sure you want to delete "${filename}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteFile(filename) },
      ]
    );
  };

  async function listSandbox() {
    try {
      const dir = FileSystem.documentDirectory!;
      const files = await FileSystem.readDirectoryAsync(dir);
      // Optional: filter only .db or .xlsx files
      setFiles(files);
      console.log("Files in sandbox:", files);
    } catch (err) {
      console.error("Error reading directory:", err);
      setFiles([]);
    }
  }

  return (
    <ScreenPrimative edges={[]}>
      <LinearGradient
        colors={['#880', '#088', '#808']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.3, y: 0.9 }}
        style={{ flex: 1, padding: 16 }}
      >
        <Button
          color={'#880'}
          viewStyle={{ marginVertical: 8 }}
          title="Export to Excel"
          onPress={async () => {
            try {
              const uri = await XLSQL.exportToExcel();
              setLastBackupUri(uri);
              Alert.alert("Success", `Backup saved:\n${uri}`);
            } catch (e) {
              console.error(e);
              Alert.alert("Export failed", (e as Error).message);
            }
          }}
        />

        <Button
          color={'#088'}
          viewStyle={{ marginVertical: 8 }}
          title="Refresh file list"
          onPress={listSandbox}
        />

        <FlatList
          data={files}
          keyExtractor={item => item}
          style={{ marginTop: 20 }}
          renderItem={({ item }) => (
            <Form.Control label={item} name="file">
              <View style={styles.row}>
                <Button
                  title="Delete"
                  color="#d32f2f"
                  onPress={() => handleDelete(item)}
                />
              </View>
            </Form.Control>
          )}
          ListEmptyComponent={<View style={{ padding: 20 }}><Text>No backup files found</Text></View>}
        />
      </LinearGradient>
    </ScreenPrimative>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
});