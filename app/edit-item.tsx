import { supabase } from '@/lib/supabase';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ImageBackground, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRefresh } from '@/contexts/RefreshContext';

export default function EditItemScreen() {
  const params = useLocalSearchParams();
  const itemId = params.id as string;

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('pcs');
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState('Other');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { triggerRefresh } = useRefresh();

  const categories = ['Dairy', 'Vegetables', 'Fruits', 'Meat', 'Grains', 'Beverages', 'Other'];
  const units = ['pcs', 'kg', 'g', 'L', 'mL', 'dozen'];

  useEffect(() => {
    loadItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only load once on mount with the itemId from params

  const loadItem = async () => {
    try {
      const { data, error } = await supabase
        .from('fridge_items')
        .select('*')
        .eq('id', itemId)
        .single();

      if (error) {
        console.error('Error loading item:', error);
        Alert.alert('Error', 'Failed to load item');
        router.back();
      } else if (data) {
        setName(data.name);
        setQuantity(data.quantity.toString());
        setUnit(data.unit);
        setCategory(data.category);
        if (data.expiry_date) {
          setExpiryDate(new Date(data.expiry_date));
        }
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to load item');
      router.back();
    } finally {
      setInitialLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setExpiryDate(selectedDate);
    }
  };

  const formatDateForDisplay = (date: Date | null) => {
    if (!date) return 'Select expiry date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateForDB = (date: Date | null) => {
    if (!date) return null;
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  };

  const handleUpdateItem = async () => {
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
      const { error } = await supabase
        .from('fridge_items')
        .update({
          name: name.trim(),
          quantity: Number(quantity),
          unit,
          expiry_date: formatDateForDB(expiryDate),
          category,
        })
        .eq('id', itemId);

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        triggerRefresh(); // Trigger refresh across all screens
        Alert.alert('Success', 'Item updated successfully!');
        router.back();
      }
    } catch (error) {
      console.error('Error updating item:', error);
      Alert.alert('Error', 'Failed to update item');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <ImageBackground
        source={require('@/assets/images/Gemini_Generated_Image_rkl2cfrkl2cfrkl2.png')}
        className="flex-1"
        blurRadius={20}
      >
        <SafeAreaView className="flex-1 justify-center items-center">
          <Text className="text-white text-lg">Loading...</Text>
        </SafeAreaView>
      </ImageBackground>
    );
  }

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
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.05)']}
              className="p-6"
            >
              <Text className="text-gray-900 text-3xl font-bold">Edit Item</Text>
              <Text className="text-gray-600 text-base mt-2">Update item details</Text>
            </LinearGradient>
          </BlurView>

          {/* Form Container */}
          <BlurView
            intensity={20}
            tint="light"
            className="rounded-3xl overflow-hidden border border-white/30 mb-6"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
              className="p-5"
            >
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
              <View className=" mb-5 gap-3">
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
                        className={`px-4 py-3 mx-1 rounded-xl ${unit === u ? 'bg-blue-500' : 'bg-white/30'}`}
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
                <ScrollView horizontal showsHorizontalScrollIndicator={true} className="flex-row gap-2">
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setCategory(cat)}
                      className={`px-5 py-3 mx-1 rounded-xl ${category === cat ? 'bg-purple-500' : 'bg-white/30'}`}
                    >
                      <Text className={`font-semibold ${category === cat ? 'text-white' : 'text-gray-700'}`}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Expiry Date */}
              <View className="mb-5">
                <Text className="text-gray-800 text-base font-semibold mb-2">Expiry Date</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  className="bg-white/40 backdrop-blur-sm border border-white/50 rounded-2xl px-4 py-4"
                >
                  <Text className={`text-base ${expiryDate ? 'text-gray-900' : 'text-gray-400'}`}>
                    {formatDateForDisplay(expiryDate)}
                  </Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={expiryDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                    minimumDate={new Date()}
                  />
                )}
              </View>
            </LinearGradient>
          </BlurView>

          {/* Action Buttons - Square Grid */}
          <View className="flex-row gap-4 mb-8">
            <TouchableOpacity
              className="flex-1"
              activeOpacity={0.7}
              onPress={handleUpdateItem}
              disabled={loading}
            >
              <BlurView
                intensity={20}
                tint="light"
                className="rounded-3xl overflow-hidden border border-white/30"
                style={{
                  backgroundColor: 'rgba(99, 102, 241, 0.3)',
                  height: 180,
                  opacity: loading ? 0.5 : 1
                }}
              >
                <LinearGradient
                  colors={['rgba(99, 102, 241, 0.3)', 'rgba(168, 85, 247, 0.3)']}
                  className="p-8 items-center justify-center h-full"
                >
                  <View className="mb-3 items-center">
                    <Text className="text-6xl mb-2">✓</Text>
                  </View>
                  <Text className="text-gray-900 text-center text-lg font-bold">
                    {loading ? 'Updating...' : 'Update Item'}
                  </Text>
                  <Text className="text-gray-600 text-center text-xs mt-1">Save changes</Text>
                </LinearGradient>
              </BlurView>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1"
              activeOpacity={0.7}
              onPress={() => router.back()}
            >
              <BlurView
                intensity={20}
                tint="light"
                className="rounded-3xl overflow-hidden border border-white/30"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  height: 180,
                }}
              >
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.05)']}
                  className="p-8 items-center justify-center h-full"
                >
                  <View className="mb-3 items-center">
                    <Text className="text-6xl mb-2">✕</Text>
                  </View>
                  <Text className="text-gray-900 text-center text-lg font-bold">Cancel</Text>
                  <Text className="text-gray-600 text-center text-xs mt-1">Go back</Text>
                </LinearGradient>
              </BlurView>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
