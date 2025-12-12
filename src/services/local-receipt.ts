// src/api/localReceipt.ts
import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PurchaseLogData } from '@db/purchase-logs/types';

export interface ReceiptMeta {
  id: string;          // UUID or timestamp
  filePath: string;    // absolute path in the device’s storage
  name: string;        // original filename (optional)
  createdAt: number;   // epoch ms
}

/**
 * Copies a temporary image URI to the app's Documents folder and stores metadata.
 *
 * @param tempUri  The URI returned by ImagePicker (e.g. `file://...` or `content://...`)
 * @returns ReceiptMeta describing where the file lives locally
 */
export async function saveReceiptLocally(tempUri: string): Promise<ReceiptMeta> {
  if (!tempUri) throw new Error('No image URI provided');

  // 1️⃣ Create a unique filename (you could also use UUID)
  const timestamp = Date.now();
  const extMatch = tempUri.match(/\.(\w+)$/);
  const extension = extMatch ? `.${extMatch[1]}` : '.jpg';
  const fileName = `receipt-${timestamp}${extension}`;

  // 2️⃣ Destination path inside the app’s Documents folder
  const destPath = `${FileSystem.documentDirectory}receipts/${fileName}`;

  // 3️⃣ Make sure the receipts directory exists
  await FileSystem.makeDirectoryAsync(
    `${FileSystem.documentDirectory}receipts`,
    { intermediates: true }
  );

  // 4️⃣ Copy the file
  await FileSystem.copyAsync({
    from: tempUri,
    to: destPath,
  });

  const meta: ReceiptMeta = {
    id: timestamp.toString(),
    filePath: destPath,
    name: fileName,
    createdAt: timestamp,
  };

  // 5️⃣ Persist the metadata (simple key/value store)
  await AsyncStorage.setItem(`receipt-${meta.id}`, JSON.stringify(meta));

  return meta;
}

/**
 * Load all stored receipts (metadata only).
 */
export async function loadAllReceipts(): Promise<PurchaseLogData[]> {
  const keys = await AsyncStorage.getAllKeys();
  const receiptKeys = keys.filter(k => k.startsWith('receipt-'));
  const stores = await AsyncStorage.multiGet(receiptKeys);
  return stores
    .map(([_, value]) => (value ? JSON.parse(value) : null))
    .filter(Boolean) as PurchaseLogData[];
}
