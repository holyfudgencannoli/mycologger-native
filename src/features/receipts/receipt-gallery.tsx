import React, { useCallback } from "react";
import { Image, FlatList, TouchableOpacity, Dimensions, Text } from "react-native";

const size = Dimensions.get("window").width / 3;


export function GalleryGrid({ data }: { data: { id: number, uri: string }[] }) {

  return (
    <FlatList
      data={data}
      numColumns={3}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity key={item.id}>
          <Image
            source={{ uri: item.uri }}
            style={{ width: size, height: size }}
          />
        </TouchableOpacity>
      )}
    />
  );
}


import { useEffect, useState } from "react";
import { View, Button } from "react-native";
// import { getImages } from "../data/db";
// import GalleryGrid from "../components/GalleryGrid";
import * as PurchLog from '@db/purchase-logs'
import { useSQLiteContext } from "expo-sqlite";
import { PurchaseLogData } from "@db/purchase-logs/types";
import { useFocusEffect } from "@react-navigation/native";
import { ScreenPrimative } from "@components/screen-primative";

export default function GalleryScreen({ navigation }) {
  const [images, setImages] = useState<{id: number, uri: string}[]>([]);
  const db = useSQLiteContext()

  async function loadImages() {
    const result: PurchaseLogData[] = await PurchLog.readAll(db);
    const pics = result.map((item, index) => (
        {
          id: index,
          uri: item.receipt_uri
        }
    ))
    console.log(pics)
    setImages(pics)
  }

  useFocusEffect(
    useCallback(() => {
      loadImages()
    }, [])
  )

  return (
    <ScreenPrimative style={{ flex: 1 }}>
      <GalleryGrid data={images} />
    </ScreenPrimative>
  );
}
