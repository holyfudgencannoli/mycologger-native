import * as FileSystem from 'expo-file-system/legacy'



export default async function saveImage(localUri: string, filename: string) {
// Ensure images folder exists
    const IMAGES_DIR = FileSystem.documentDirectory + "images/";

    const dirInfo = await FileSystem.getInfoAsync(IMAGES_DIR);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(IMAGES_DIR, { intermediates: true });
    }

    const dest = IMAGES_DIR + filename;
    await FileSystem.copyAsync({
        from: localUri,
        to: dest,
    });

    return dest; // <- this becomes item.filePath
}



