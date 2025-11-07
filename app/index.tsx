import { FridgeItem, supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
      <SafeAreaView className="flex-1 justify-center items-center" style={{ backgroundColor: '#E6E9F0' }}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: '#D8DCE8' }}>
      <LinearGradient
        colors={['#DBE7FF', '#E8E4FF', '#F5E8F5']}
        className="flex-1"
      >
        <SafeAreaView className="flex-1">
          <ScrollView className="flex-1 px-5">
            {/* Header with glassmorphism */}
            <View 
              className="mt-4 mb-5 rounded-3xl p-6"
              style={{
                backgroundColor: Platform.OS === 'web' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.35)',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              <View className="flex-row items-center">
                <View 
                  className="w-12 h-12 rounded-full items-center justify-center mr-3"
                  style={{
                    backgroundColor: '#6366F1',
                  }}
                >
                  <Text className="text-2xl">👋</Text>
                </View>
                <View>
                  <Text className="text-gray-600 text-sm">Good morning,</Text>
                  <Text className="text-gray-900 text-2xl font-bold">Michelle</Text>
                </View>
              </View>
            </View>

            {/* Weather/Date Card */}
            <View className="flex-row mb-5 gap-3">
              <View 
                className="flex-1 rounded-2xl p-4"
                style={{
                  backgroundColor: Platform.OS === 'web' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.4)',
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.6)',
                }}
              >
                <Text className="text-gray-600 text-xs mb-1">Thursday, 17 Sep</Text>
                <Text className="text-gray-900 text-xl font-bold">11:24am</Text>
              </View>
              <View 
                className="flex-1 rounded-2xl p-4"
                style={{
                  backgroundColor: Platform.OS === 'web' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.4)',
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.6)',
                }}
              >
                <Text className="text-gray-600 text-xs mb-1">Mostly sunny</Text>
                <View className="flex-row items-center">
                  <Text className="text-gray-900 text-xl font-bold">18°C</Text>
                  <Text className="text-3xl ml-2">☀️</Text>
                </View>
              </View>
            </View>

            {/* What I have in section */}
            <View 
              className="rounded-3xl p-5 mb-6"
              style={{
                backgroundColor: Platform.OS === 'web' ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255, 255, 255, 0.35)',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              <Text className="text-gray-900 text-xl font-bold mb-4">What I have in</Text>
              
              <View className="flex-row mb-4">
                <TouchableOpacity 
                  className="px-6 py-2 rounded-full mr-3"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  <Text className="text-gray-900 font-semibold">Fridge</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  className="px-6 py-2 rounded-full"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  }}
                >
                  <Text className="text-gray-700 font-medium">Pantry</Text>
                </TouchableOpacity>
              </View>

              {/* Items List */}
              {items.slice(0, 5).map((item) => (
                <View 
                  key={item.id} 
                  className="rounded-2xl p-3 mb-3 flex-row items-center"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  <View 
                    className="w-12 h-12 rounded-full mr-3"
                    style={{
                      backgroundColor: '#FB7185',
                    }}
                  />
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
                className="rounded-2xl p-4 mb-3"
                style={{
                  backgroundColor: '#6366F1',
                }}
                onPress={() => router.push('/add-item')}
              >
                <Text className="text-white text-center text-lg font-bold">➕ Add Item</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                className="rounded-2xl p-4 mb-3"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.6)',
                }}
                onPress={() => router.push('/inventory')}
              >
                <Text className="text-gray-900 text-center text-lg font-bold">📦 View Inventory ({stats.total})</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                className="rounded-2xl p-4"
                style={{
                  backgroundColor: '#A855F7',
                }}
                onPress={() => router.push('/recipes')}
              >
                <Text className="text-white text-center text-lg font-bold">🤖 Generate Recipes</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
