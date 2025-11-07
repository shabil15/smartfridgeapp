import React from 'react';
import { ScrollView, Text, View } from 'react-native';

interface RecipeCardProps {
  recipe: string;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <View className="bg-white/30 backdrop-blur-xl rounded-3xl p-5 border border-white/40 mb-4 max-h-96">
      <ScrollView showsVerticalScrollIndicator={true}>
        <Text className="text-gray-900 text-sm leading-6">{recipe}</Text>
      </ScrollView>
    </View>
  );
}
