// components/ui/Screen.tsx
import React, { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../hooks/useTheme";

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;                  // make content scrollable
  style?: ViewStyle;                 // container style
  contentContainerStyle?: ViewStyle; // scroll content style
  edges?: Array<"top" | "bottom" | "left" | "right">; // SafeArea edges
  keyboardOffset?: number;           // additional keyboard offset
};

export const ScreenPrimative: React.FC<ScreenProps> = ({
  children,
  scroll = false,
  style,
  contentContainerStyle,
  edges,
  keyboardOffset = 0
}) => {
  const { theme } = useTheme();

  const Container = scroll ? ScrollView : View;

  return (
    <SafeAreaView style={[styles.safeArea]} edges={edges}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={keyboardOffset}
      >
        <Container
          contentContainerStyle={!scroll ? [styles.contentContainer, contentContainerStyle] : undefined}
          style={!scroll ? [styles.flex, style] : [styles.contentContainer, style]}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </Container>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 16,
  },
});
