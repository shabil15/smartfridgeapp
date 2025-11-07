import RecipeCard from '@/components/RecipeCard';
import { generateRecipe } from '@/lib/gemini';
import { FridgeItem, supabase } from '@/lib/supabase';
import { BlurView } from 'expo-blur';
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
      source={require('@/assets/images/Gemini_Generated_Image_rkl2cfrkl2cfrkl2.png')}
      className="flex-1"
      blurRadius={20}
    >
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1 px-5">
          {/* Header */}
          <BlurView
            intensity={20}
            tint="light"
            className="mt-4 mb-6 rounded-3xl overflow-hidden border border-white/30"
            style={{ backgroundColor: 'rgba(168, 85, 247, 0.2)' }}
          >
            <LinearGradient
              colors={['rgba(168, 85, 247, 0.3)', 'rgba(147, 51, 234, 0.2)']}
              className="p-6"
            >
              <Text className="text-gray-900 text-3xl font-bold mb-2">🤖 AI Recipe Generator</Text>
              <Text className="text-gray-700 text-sm">
                Get personalized recipe suggestions based on your fridge items
              </Text>
            </LinearGradient>
          </BlurView>

          {/* Ingredients Card */}
          <BlurView
            intensity={20}
            tint="light"
            className="rounded-3xl overflow-hidden border border-white/30 mb-5"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
              className="p-5"
            >
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
          </LinearGradient>
          </BlurView>

          {/* Generate Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleGenerateRecipes}
            disabled={loading || items.length === 0}
          >
            <BlurView
              intensity={20}
              tint="light"
              className="rounded-2xl overflow-hidden border border-white/30 mb-5"
              style={{ 
                backgroundColor: 'rgba(168, 85, 247, 0.3)',
                opacity: loading || items.length === 0 ? 0.5 : 1
              }}
            >
              <LinearGradient
                colors={['rgba(168, 85, 247, 0.3)', 'rgba(236, 72, 153, 0.3)']}
                className="p-5 items-center"
              >
                {loading ? (
                  <ActivityIndicator color="#4B5563" />
                ) : (
                  <Text className="text-gray-900 text-lg font-bold">✨ Generate Recipes</Text>
                )}
              </LinearGradient>
            </BlurView>
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
            <BlurView
              intensity={15}
              tint="light"
              className="rounded-2xl overflow-hidden border border-white/20 mb-8"
              style={{ backgroundColor: 'rgba(233, 213, 255, 0.3)' }}
            >
              <View className="p-5">
                <Text className="text-purple-900 text-sm leading-6">
                  💡 Tap the button above to get AI-powered recipe suggestions based on your
                  available ingredients. The AI will suggest creative and easy-to-make recipes!
                </Text>
              </View>
            </BlurView>
          )}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
