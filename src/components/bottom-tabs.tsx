// MyTabBar.tsx
import { View, Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";



export function MyTabBar({ navigation, state }) {


    
  const tabs: {name: string, icon: string}[] = [
    { name: "New Item", icon: "add-circle" },
    { name: "New Purchase Log", icon: "receipt" },
  ];

  return (
    <View style={{
      flexDirection: "row",
      height: 100,
      backgroundColor: "#222",
    //   alignItems: "center",
    }}>
      {tabs.map((tab, index) => {
        const isFocused = state.routes[state.index].name === tab.name;

        return (
          <Pressable
            key={tab.name}
            onPress={() => navigation.navigate(tab.name)}
            style={{ flex: 1, alignItems: "center", padding: 10 }}
          >
            <Ionicons
              name={tab.icon}
              size={22}
              color={isFocused ? "white" : "gray"}
            />
            <Text style={{ color: isFocused ? "white" : "gray" }}>
              {tab.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
