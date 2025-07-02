import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function _layout() {
  return (
    <Stack screenOptions={{
        headerShadowVisible:true
    }}>
        <Stack.Screen name='login'/>
        <Stack.Screen name='signup'/>
    </Stack>
  )
}