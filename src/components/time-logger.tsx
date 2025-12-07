import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TimeLogger({
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  onTimesSet,
}) {
    
  const handlePress = async () => {
    if (!startTime) {
      // First click → Save start time
      const now = new Date();
      await AsyncStorage.setItem("start_time", now.toISOString());
      setStartTime(now);
      console.log("Start time saved:", now.toISOString());
    } else {
      // Second click → Save end time and notify parent
      const end = new Date();
      await AsyncStorage.setItem("end_time", end.toISOString());
      setEndTime(end);

      if (onTimesSet) onTimesSet({ startTime, endTime: end });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {startTime
          ? `Started at: ${startTime.toLocaleTimeString()}`
          : "Press to start"}
      </Text>
      <Text style={styles.text}>
        {endTime
          ? `Last Task ended at: ${endTime.toLocaleTimeString()}`
          : "Press again to End"}
      </Text>
      <Button
        title={startTime ? "Stop & Log" : "Start"}
        onPress={handlePress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, marginBottom: 20, color: 'white' },
});