import { FridgeItem, supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function DashboardScreen() {
  const [items, setItems] = useState<FridgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, expiringSoon: 0 });

  const calculateStats = useCallback((items: FridgeItem[]) => {
    const today = new Date();
    const expiringSoon = items.filter(item => {
      if (!item.expiry_date) return false;
      const expiry = new Date(item.expiry_date);
      const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry >= 0 && daysUntilExpiry <= 3;
    }).length;

    setStats({ total: items.length, expiringSoon });
  }, []);

  const loadItems = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('fridge_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading items:', error);
        if (error.code === '42P01') {
          alert('Please create the fridge_items table in Supabase first.');
        }
      } else {
        setItems(data || []);
        calculateStats(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1557683311-eac922347aa1?w=800' }}
      className="flex-1"
      blurRadius={50}
    >
      <LinearGradient
        colors={['rgba(219, 234, 254, 0.8)', 'rgba(243, 232, 255, 0.8)', 'rgba(254, 242, 242, 0.8)']}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-5">
          {/* Header with glassmorphism */}
          <View className="mt-16 mb-6 bg-white/20 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl">
            <View className="flex-row items-center mb-2">
              <View className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full items-center justify-center mr-3">
                <Text className="text-2xl">👋</Text>
              </View>
              <View>
                <Text className="text-gray-700 text-base font-medium">Good morning,</Text>
                <Text className="text-gray-900 text-2xl font-bold">Michelle</Text>
              </View>
            </View>
          </View>

          {/* Weather/Date Card */}
          <View className="flex-row mb-6 gap-3">
            <View className="flex-1 bg-white/25 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
              <Text className="text-gray-700 text-sm mb-1">Thursday, 17 Sep</Text>
              <Text className="text-gray-900 text-xl font-bold">11:24am</Text>
            </View>
            <View className="flex-1 bg-white/25 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
              <Text className="text-gray-700 text-sm mb-1">Mostly sunny</Text>
              <View className="flex-row items-center">
                <Text className="text-gray-900 text-xl font-bold">18°C</Text>
                <Text className="text-3xl ml-2">☀️</Text>
              </View>
            </View>
          </View>

          {/* What I have in section */}
          <View className="bg-white/20 backdrop-blur-xl rounded-3xl p-5 border border-white/30 mb-6">
            <Text className="text-gray-900 text-xl font-bold mb-4">What I have in</Text>
            
            <View className="flex-row mb-4">
              <TouchableOpacity className="bg-white/40 px-6 py-2 rounded-full mr-3">
                <Text className="text-gray-900 font-semibold">Fridge</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-white/20 px-6 py-2 rounded-full">
                <Text className="text-gray-700 font-medium">Pantry</Text>
              </TouchableOpacity>
            </View>

            {/* Items List */}
            {items.slice(0, 5).map((item) => (
              <View key={item.id} className="bg-white/30 rounded-2xl p-3 mb-3 flex-row items-center">
                <View className="w-12 h-12 bg-gradient-to-br from-pink-300 to-red-400 rounded-full mr-3" />
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold text-base">{item.name}</Text>
                </View>
                <Text className="text-gray-700 font-medium">{item.quantity}{item.unit}</Text>
              </View>
            ))}
          </View>

          {/* Action Buttons */}
          <View className="mb-8">
            <TouchableOpacity 
              className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-4 mb-3 shadow-lg"
              onPress={() => router.push('/add-item')}
            >
              <Text className="text-white text-center text-lg font-bold">➕ Add Item</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl p-4 mb-3"
              onPress={() => router.push('/inventory')}
            >
              <Text className="text-gray-900 text-center text-lg font-bold">📦 View Inventory ({stats.total})</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-4 shadow-lg"
              onPress={() => router.push('/recipes')}
            >
              <Text className="text-white text-center text-lg font-bold">🤖 Generate Recipes</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
}
