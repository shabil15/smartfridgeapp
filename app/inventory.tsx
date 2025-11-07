import ItemCard from '@/components/ItemCard';
import { FridgeItem, supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, ImageBackground, Text, TouchableOpacity, View } from 'react-native';

export default function InventoryScreen() {
  const [items, setItems] = useState<FridgeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const { data, error } = await supabase
        .from('fridge_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading items:', error);
        Alert.alert('Error', 'Failed to load items');
      } else {
        setItems(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (id: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to remove this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase.from('fridge_items').delete().eq('id', id);

              if (error) {
                Alert.alert('Error', 'Failed to delete item');
              } else {
                loadItems();
              }
            } catch (error) {
              console.error('Error removing item:', error);
            }
          },
        },
      ]
    );
  };

  const handleEditItem = (item: FridgeItem) => {
    Alert.alert('Edit Item', 'Edit functionality will be implemented soon');
  };

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
        <View className="flex-1">
          {/* Header */}
          <View className="mt-16 mx-5 mb-6 bg-white/25 backdrop-blur-xl rounded-3xl p-6 border border-white/40">
            <Text className="text-gray-900 text-3xl font-bold">📦 Fridge Inventory</Text>
            <Text className="text-gray-600 text-base mt-2">{items.length} items stored</Text>
          </View>

          {items.length === 0 ? (
            <View className="flex-1 justify-center items-center px-10">
              <View className="bg-white/25 backdrop-blur-xl rounded-3xl p-8 border border-white/40 items-center">
                <Text className="text-6xl mb-4">🍽️</Text>
                <Text className="text-gray-700 text-lg font-semibold mb-6 text-center">No items in your fridge</Text>
                <TouchableOpacity
                  className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl px-8 py-4"
                  onPress={() => router.push('/add-item')}
                >
                  <Text className="text-white text-base font-bold">➕ Add Your First Item</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <FlatList
              data={items}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ItemCard item={item} onEdit={handleEditItem} onRemove={handleRemoveItem} />
              )}
              contentContainerStyle={{ padding: 20 }}
            />
          )}
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}
