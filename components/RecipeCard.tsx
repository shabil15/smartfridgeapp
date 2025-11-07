import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export interface Recipe {
  name: string;
  ingredients: string[];
  steps: string[];
}

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
}

export default function RecipeCard({ recipe, index }: RecipeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <BlurView
      intensity={20}
      tint="light"
      className="rounded-3xl overflow-hidden border border-white/30 mb-4"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
    >
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
        className="p-5"
      >
        {/* Recipe Header */}
        <View className="mb-4">
          <View className="flex-row items-center mb-2">
            <View className="bg-purple-500/80 rounded-full w-8 h-8 items-center justify-center mr-3">
              <Text className="text-white text-sm font-bold">{index + 1}</Text>
            </View>
            <Text className="text-gray-900 text-xl font-bold flex-1">{recipe.name}</Text>
          </View>
        </View>

        {/* Ingredients Section */}
        <View className="mb-4">
          <Text className="text-gray-800 text-base font-semibold mb-2">📋 Ingredients:</Text>
          <View className="bg-white/30 rounded-2xl p-3">
            {recipe.ingredients.map((ingredient, idx) => (
              <View key={idx} className="flex-row items-start mb-1">
                <Text className="text-gray-700 text-sm mr-2">•</Text>
                <Text className="text-gray-800 text-sm flex-1">{ingredient}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Steps Section - Collapsible */}
        <View>
          <TouchableOpacity
            onPress={() => setIsExpanded(!isExpanded)}
            className="flex-row items-center justify-between mb-2"
          >
            <Text className="text-gray-800 text-base font-semibold">👨‍🍳 Instructions:</Text>
            <Text className="text-purple-600 text-sm font-semibold">
              {isExpanded ? '▼ Hide' : '▶ Show'}
            </Text>
          </TouchableOpacity>

          {isExpanded && (
            <View className="bg-white/30 rounded-2xl p-3">
              {recipe.steps.map((step, idx) => (
                <View key={idx} className="flex-row items-start mb-3">
                  <View className="bg-purple-500/60 rounded-full w-6 h-6 items-center justify-center mr-3 mt-0.5">
                    <Text className="text-white text-xs font-bold">{idx + 1}</Text>
                  </View>
                  <Text className="text-gray-800 text-sm flex-1 leading-5">{step}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </LinearGradient>
    </BlurView>
  );
}
