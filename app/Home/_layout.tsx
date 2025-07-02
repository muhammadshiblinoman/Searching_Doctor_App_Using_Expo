import { Stack } from 'expo-router'
import React from 'react'

export default function _layout() {
  return (
    <Stack screenOptions={{
        headerShadowVisible:true
    }}>
        <Stack.Screen name='home'/>
    </Stack>
  )
}