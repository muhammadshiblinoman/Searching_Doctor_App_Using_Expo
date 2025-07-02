import React from "react";

import { Stack } from "expo-router";
// const Stack = createNativeStackNavigator();

export default function RootLayout() {
  return (
    <Stack screenOptions={{
      headerShown:false
  }}>
      <Stack.Screen name="screen" />
      <Stack.Screen name="Home" />
    </Stack>
  );
}