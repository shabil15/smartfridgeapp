import RecipeCard, { Recipe } from '@/components/RecipeCard';
import { generateRecipe } from '@/lib/gemini';
import { FridgeItem, supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const RECIPES_STORAGE_KEY = '@saved_recipes';

export default function RecipesScreen() {
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<FridgeItem[]>([]);

  useEffect(() => {
    loadItems();
    loadSavedRecipes();
  }, []);

  const loadSavedRecipes = async () => {
    try {
      const savedRecipes = await AsyncStorage.getItem(RECIPES_STORAGE_KEY);
      if (savedRecipes !== null) {
        const parsedRecipes = JSON.parse(savedRecipes);
        setRecipes(parsedRecipes);
      }
    } catch (error) {
      console.error('Error loading saved recipes:', error);
    }
  };

  const saveRecipes = async (recipesToSave: Recipe[]) => {
    try {
      await AsyncStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(recipesToSave));
    } catch (error) {
      console.error('Error saving recipes:', error);
    }
  };

  const clearRecipes = async () => {
    try {
      await AsyncStorage.removeItem(RECIPES_STORAGE_KEY);
      setRecipes([]);
      setError(null);
    } catch (error) {
      console.error('Error clearing recipes:', error);
    }
  };

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
    setRecipes([]);
    setError(null);

    try {
      // Include quantity and unit with each item name
      const itemsWithQuantities = items.map((item) => 
        `${item.quantity}${item.unit} ${item.name}`
      );
      const generatedRecipes = await generateRecipe(itemsWithQuantities);
      
      // Clean the response - remove markdown code blocks if present
      let cleanedResponse = generatedRecipes.trim();
      
      // Remove ```json and ``` if present
      if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      }
      
      // Parse JSON safely
      try {
        const parsedRecipes = JSON.parse(cleanedResponse);
        
        // Validate that it's an array
        if (!Array.isArray(parsedRecipes)) {
          throw new Error('Response is not an array');
        }
        
        // Validate each recipe has required fields
        const validRecipes = parsedRecipes.filter((recipe: any) => {
          return (
            recipe &&
            typeof recipe.name === 'string' &&
            Array.isArray(recipe.ingredients) &&
            Array.isArray(recipe.steps)
          );
        });
        
        if (validRecipes.length === 0) {
          throw new Error('No valid recipes found in response');
        }
        
        setRecipes(validRecipes);
        await saveRecipes(validRecipes);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Raw response:', generatedRecipes);
        setError('Failed to parse recipes. The AI response was not in the expected format.');
        Alert.alert(
          'Parse Error',
          'The AI returned an invalid format. Please try again.'
        );
      }
    } catch (error: any) {
      console.error('Error generating recipes:', error);
      setError(error.message || 'Failed to generate recipes');
      Alert.alert('Error', error.message || 'Failed to generate recipes. Please try again.');
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
            <BlurView
              style={{ backgroundColor: 'rgba(99, 102, 241, 0.3)' }}
              className="p-6"
            >
              <Text className="text-gray-900 text-3xl font-bold mb-2"> AI Recipe Generator</Text>
              <Text className="text-gray-700 text-sm">
                Get personalized recipe suggestions based on your fridge items
              </Text>
            </BlurView>
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
                // backgroundColor: 'rgba(168, 85, 247, 0.3)',
                opacity: loading || items.length === 0 ? 0.5 : 1
              }}
            >
              <BlurView
                style={{ backgroundColor: 'rgba(99, 102, 241, 0.3)' }}
                className="p-5 items-center"
              >
                {loading ? (
                  <ActivityIndicator color="#4B5563" />
                ) : (
                  <Text className="text-gray-900 text-lg font-bold">✨ Generate Recipes</Text>
                )}
              </BlurView>
            </BlurView>
          </TouchableOpacity>

          {/* Recipes Display */}
          {recipes.length > 0 && (
            <View className="mb-5">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-gray-900 text-xl font-bold">🍳 Suggested Recipes:</Text>
                <TouchableOpacity
                  onPress={clearRecipes}
                  activeOpacity={0.7}
                >
                  <BlurView
                    intensity={15}
                    tint="light"
                    className="rounded-full overflow-hidden border border-white/30"
                    style={{ backgroundColor: 'rgba(239, 68, 68, 0.3)' }}
                  >
                    <View className="px-4 py-2">
                      <Text className="text-red-800 text-xs font-bold">🗑️ Clear</Text>
                    </View>
                  </BlurView>
                </TouchableOpacity>
              </View>
              {recipes.map((recipe, index) => (
                <RecipeCard key={index} recipe={recipe} index={index} />
              ))}
            </View>
          )}

          {/* Error Display */}
          {error && !loading && (
            <BlurView
              intensity={15}
              tint="light"
              className="rounded-2xl overflow-hidden border border-red-300 mb-5"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
            >
              <View className="p-5">
                <Text className="text-red-800 text-sm font-semibold mb-2">⚠️ Error</Text>
                <Text className="text-red-700 text-sm leading-6">{error}</Text>
              </View>
            </BlurView>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <View className="mb-5">
              <Text className="text-gray-900 text-xl font-bold mb-4">🍳 Generating Recipes...</Text>
              {[1, 2, 3].map((_, index) => (
                <BlurView
                  key={index}
                  intensity={15}
                  tint="light"
                  className="rounded-3xl overflow-hidden border border-white/20 mb-4"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <View className="p-5">
                    <View className="flex-row items-center mb-4">
                      <View className="bg-gray-300/50 rounded-full w-8 h-8 mr-3" />
                      <View className="bg-gray-300/50 rounded-2xl h-6 flex-1" />
                    </View>
                    <View className="bg-gray-300/50 rounded-2xl h-20 mb-3" />
                    <View className="bg-gray-300/50 rounded-2xl h-12" />
                  </View>
                </BlurView>
              ))}
            </View>
          )}

          {/* Info Card */}
          {recipes.length === 0 && !loading && !error && (
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
