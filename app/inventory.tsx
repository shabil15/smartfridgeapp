import ItemCard from '@/components/ItemCard';
import { FridgeItem, supabase } from '@/lib/supabase';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
      <ImageBackground
        source={require('@/assets/images/jason-briscoe-GliaHAJ3_5A-unsplash.jpg')}
        className="flex-1"
        blurRadius={10}
      >
        <SafeAreaView className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FFFFFF" />
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('@/assets/images/jason-briscoe-GliaHAJ3_5A-unsplash.jpg')}
      className="flex-1"
      blurRadius={10}
    >
      <SafeAreaView className="flex-1">
        <View className="flex-1">
          {/* Header */}
          <BlurView
            intensity={20}
            tint="light"
            className="mt-4 mx-5 mb-6 rounded-3xl overflow-hidden border border-white/30"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.05)']}
              className="p-6"
            >
              <Text className="text-gray-900 text-3xl font-bold">📦 Fridge Inventory</Text>
              <Text className="text-gray-600 text-base mt-2">{items.length} items stored</Text>
            </LinearGradient>
          </BlurView>

          {items.length === 0 ? (
            <View className="flex-1 justify-center items-center px-10">
              <BlurView
                intensity={20}
                tint="light"
                className="rounded-3xl overflow-hidden border border-white/30"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
                  className="p-8 items-center"
                >
                  <Text className="text-6xl mb-4">🍽️</Text>
                  <Text className="text-gray-700 text-lg font-semibold mb-6 text-center">No items in your fridge</Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => router.push('/add-item')}
                  >
                    <BlurView
                      intensity={15}
                      tint="light"
                      className="rounded-2xl overflow-hidden border border-white/30"
                      style={{ backgroundColor: 'rgba(99, 102, 241, 0.3)' }}
                    >
                      <View className="px-8 py-4">
                        <Text className="text-gray-900 text-base font-bold">➕ Add Your First Item</Text>
                      </View>
                    </BlurView>
                  </TouchableOpacity>
                </LinearGradient>
              </BlurView>
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
      </SafeAreaView>
    </ImageBackground>
  );
}
