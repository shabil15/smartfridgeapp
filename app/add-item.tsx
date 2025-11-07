import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ImageBackground, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AddItemScreen() {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('pcs');
  const [expiryDate, setExpiryDate] = useState('');
  const [category, setCategory] = useState('Other');
  const [loading, setLoading] = useState(false);

  const categories = ['Dairy', 'Vegetables', 'Fruits', 'Meat', 'Grains', 'Beverages', 'Other'];
  const units = ['pcs', 'kg', 'g', 'L', 'mL', 'dozen'];

  const handleAddItem = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter item name');
      return;
    }

    if (!quantity || isNaN(Number(quantity))) {
      Alert.alert('Error', 'Please enter valid quantity');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('fridge_items').insert([
        {
          name: name.trim(),
          quantity: Number(quantity),
          unit,
          expiry_date: expiryDate || null,
          category,
        },
      ]);

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success', 'Item added successfully!');
        router.back();
      }
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Error', 'Failed to add item');
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
        colors={['rgba(219, 234, 254, 0.85)', 'rgba(243, 232, 255, 0.85)']}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-5">
          {/* Header */}
          <View className="mt-16 mb-6 bg-white/25 backdrop-blur-xl rounded-3xl p-6 border border-white/40">
            <Text className="text-gray-900 text-3xl font-bold">➕ Add New Item</Text>
            <Text className="text-gray-600 text-base mt-2">Add ingredients to your smart fridge</Text>
          </View>

          {/* Form Container */}
          <View className="bg-white/20 backdrop-blur-xl rounded-3xl p-5 border border-white/30 mb-6">
            {/* Item Name */}
            <View className="mb-5">
              <Text className="text-gray-800 text-base font-semibold mb-2">Item Name *</Text>
              <TextInput
                className="bg-white/40 backdrop-blur-sm border border-white/50 rounded-2xl px-4 py-4 text-gray-900 text-base"
                value={name}
                onChangeText={setName}
                placeholder="e.g., Milk, Eggs, Tomatoes"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Quantity & Unit */}
            <View className="flex-row mb-5 gap-3">
              <View className="flex-1">
                <Text className="text-gray-800 text-base font-semibold mb-2">Quantity *</Text>
                <TextInput
                  className="bg-white/40 backdrop-blur-sm border border-white/50 rounded-2xl px-4 py-4 text-gray-900 text-base"
                  value={quantity}
                  onChangeText={setQuantity}
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 text-base font-semibold mb-2">Unit</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                  {units.map((u) => (
                    <TouchableOpacity
                      key={u}
                      onPress={() => setUnit(u)}
                      className={`px-4 py-3 rounded-xl ${unit === u ? 'bg-blue-500' : 'bg-white/30'}`}
                    >
                      <Text className={`font-semibold ${unit === u ? 'text-white' : 'text-gray-700'}`}>{u}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Category */}
            <View className="mb-5">
              <Text className="text-gray-800 text-base font-semibold mb-2">Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setCategory(cat)}
                    className={`px-5 py-3 rounded-xl ${category === cat ? 'bg-purple-500' : 'bg-white/30'}`}
                  >
                    <Text className={`font-semibold ${category === cat ? 'text-white' : 'text-gray-700'}`}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Expiry Date */}
            <View className="mb-5">
              <Text className="text-gray-800 text-base font-semibold mb-2">Expiry Date (YYYY-MM-DD)</Text>
              <TextInput
                className="bg-white/40 backdrop-blur-sm border border-white/50 rounded-2xl px-4 py-4 text-gray-900 text-base"
                value={expiryDate}
                onChangeText={setExpiryDate}
                placeholder="2024-12-31"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            onPress={handleAddItem}
            disabled={loading}
            className={`bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-5 mb-4 ${loading ? 'opacity-50' : ''}`}
          >
            <Text className="text-white text-center text-lg font-bold">
              {loading ? 'Adding...' : '✓ Add to Fridge'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-white/25 backdrop-blur-xl border border-white/40 rounded-2xl p-5 mb-8"
          >
            <Text className="text-gray-900 text-center text-lg font-bold">Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
}
