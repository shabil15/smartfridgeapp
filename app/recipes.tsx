import RecipeCard from '@/components/RecipeCard';
import { generateRecipe } from '@/lib/gemini';
import { FridgeItem, supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RecipesScreen() {
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState('');
  const [items, setItems] = useState<FridgeItem[]>([]);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const { data, error } = await supabase
        .from('fridge_items')
        .select('*');

      if (error) {
        console.error('Error loading items:', error);
      } else {
        setItems(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleGenerateRecipes = async () => {
    if (items.length === 0) {
      Alert.alert('No Items', 'Please add some items to your fridge first');
      return;
    }

    setLoading(true);
    setRecipes('');

    try {
      const itemNames = items.map((item) => item.name);
      const generatedRecipes = await generateRecipe(itemNames);
      setRecipes(generatedRecipes);
    } catch (error) {
      console.error('Error generating recipes:', error);
      Alert.alert('Error', 'Failed to generate recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1557683311-eac922347aa1?w=800' }}
      className="flex-1"
      blurRadius={50}
    >
      <LinearGradient
        colors={['rgba(236, 233, 254, 0.85)', 'rgba(249, 232, 255, 0.85)', 'rgba(254, 242, 242, 0.85)']}
        className="flex-1"
      >
        <SafeAreaView className="flex-1">
          <ScrollView className="flex-1 px-5">
            {/* Header */}
            <View className="mt-4 mb-6 bg-purple-500/80 backdrop-blur-xl rounded-3xl p-6 border border-white/40">
              <Text className="text-white text-3xl font-bold mb-2">🤖 AI Recipe Generator</Text>
              <Text className="text-purple-100 text-sm">
                Get personalized recipe suggestions based on your fridge items
              </Text>
            </View>

            {/* Ingredients Card */}
            <View className="bg-white/25 backdrop-blur-xl rounded-3xl p-5 border border-white/40 mb-5">
            <Text className="text-gray-900 text-lg font-bold mb-3">Your Ingredients:</Text>
            {items.length > 0 ? (
              <View className="flex-row flex-wrap gap-2">
                {items.map((item) => (
                  <View key={item.id} className="bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50">
                    <Text className="text-gray-800 text-sm font-medium">
                      {item.name} ({item.quantity} {item.unit})
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-gray-600 text-sm italic">
                No ingredients available. Add some items first!
              </Text>
            )}
          </View>

          {/* Generate Button */}
          <TouchableOpacity
            className={`bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-5 mb-5 items-center ${loading || items.length === 0 ? 'opacity-50' : ''}`}
            onPress={handleGenerateRecipes}
            disabled={loading || items.length === 0}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-lg font-bold">✨ Generate Recipes</Text>
            )}
          </TouchableOpacity>

          {/* Recipes Display */}
          {recipes && (
            <View className="mb-5">
              <Text className="text-gray-900 text-xl font-bold mb-4">🍳 Suggested Recipes:</Text>
              <RecipeCard recipe={recipes} />
            </View>
          )}

          {/* Info Card */}
          {!recipes && !loading && (
            <View className="bg-purple-100/60 backdrop-blur-sm rounded-2xl p-5 border border-purple-200/50 mb-8">
              <Text className="text-purple-900 text-sm leading-6">
                💡 Tap the button above to get AI-powered recipe suggestions based on your
                available ingredients. The AI will suggest creative and easy-to-make recipes!
              </Text>
            </View>
          )}
        </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}
