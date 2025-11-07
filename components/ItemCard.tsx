import { FridgeItem } from '@/lib/supabase';
import { BlurView } from 'expo-blur';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ItemCardProps {
  item: FridgeItem;
  onEdit: (item: FridgeItem) => void;
  onRemove: (id: string) => void;
}

export default function ItemCard({ item, onEdit, onRemove }: ItemCardProps) {

  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      'Dairy': '🥛',
      'Vegetables': '🥬',
      'Fruits': '🍎',
      'Meat': '🍖',
      'Grains': '🌾',
      'Beverages': '🥤',
      'Other': '🍲',
    };
    return emojis[category] || '';
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
    >
      <BlurView
        intensity={15}
        tint="light"
        className="rounded-3xl overflow-hidden border border-white/20 mb-3"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
      >
        <View className="p-4 flex-row items-center">
          {/* Category Emoji with circular background */}
          <View className="w-14 h-14 rounded-full bg-white/50 items-center justify-center mr-4">
            <Text className="text-3xl">{getCategoryEmoji(item.category)}</Text>
          </View>

          {/* Item Name */}
          <View className="flex-1">
            <Text className="text-gray-900 text-base font-semibold">{item.name}</Text>
          </View>

          {/* Quantity - Always visible */}
          <View className="bg-white/40 rounded-full p-4 mr-1">
            <Text className="text-gray-800 text-sm font-medium">
              {item.quantity}{item.unit}
            </Text>
          </View>

          {/* Action Buttons - Show when expanded */}
            <View className="flex-row gap-1">
              {/* Edit Button */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
              >
                <View className=" rounded-full w-10 h-10 items-center justify-center">
                  <Text className="text-white text-lg">✏️</Text>
                </View>
              </TouchableOpacity>

              {/* Remove Button */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={(e) => {
                  e.stopPropagation();
                  onRemove(item.id);
                }}
              >
                <View className=" rounded-full w-10 h-10 items-center justify-center">
                  <Text className="text-white text-lg">🗑️</Text>
                </View>
              </TouchableOpacity>
            </View>
        </View>
      </BlurView>
    </TouchableOpacity>
  );
}
