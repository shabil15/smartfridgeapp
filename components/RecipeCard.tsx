import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, Text } from 'react-native';

interface RecipeCardProps {
  recipe: string;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <BlurView
      intensity={20}
      tint="light"
      className="rounded-3xl overflow-hidden border border-white/30 mb-4"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', maxHeight: 384 }}
    >
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
        className="p-5"
      >
        <ScrollView showsVerticalScrollIndicator={true}>
          <Text className="text-gray-900 text-sm leading-6">{recipe}</Text>
        </ScrollView>
      </LinearGradient>
    </BlurView>
  );
}
