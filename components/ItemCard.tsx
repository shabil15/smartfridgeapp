import { FridgeItem } from '@/lib/supabase';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ItemCardProps {
  item: FridgeItem;
  onEdit: (item: FridgeItem) => void;
  onRemove: (id: string) => void;
}

export default function ItemCard({ item, onEdit, onRemove }: ItemCardProps) {
  const getExpiryColor = () => {
    if (!item.expiry_date) return 'bg-gray-500'; // gray
    
    const today = new Date();
    const expiry = new Date(item.expiry_date);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return 'bg-red-500'; // red - expired
    if (daysUntilExpiry <= 3) return 'bg-orange-500'; // orange - expiring soon
    return 'bg-green-500'; // green - fresh
  };

  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      'Dairy': '🥛',
      'Vegetables': '🥬',
      'Fruits': '🍎',
      'Meat': '🍖',
      'Grains': '🌾',
      'Beverages': '🥤',
      'Other': '📦',
    };
    return emojis[category] || '📦';
  };

  return (
    <View className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 mb-3 border border-white/40">
      <View className="flex-row items-center">
        {/* Category Icon */}
        <View className="w-12 h-12 bg-gradient-to-br from-purple-300 to-pink-400 rounded-full items-center justify-center mr-3">
          <Text className="text-2xl">{getCategoryEmoji(item.category)}</Text>
        </View>

        {/* Content */}
        <View className="flex-1">
          <Text className="text-gray-900 text-lg font-bold">{item.name}</Text>
          <Text className="text-gray-600 text-sm">
            {item.quantity}{item.unit} • {item.category}
          </Text>
          {item.expiry_date && (
            <View className="flex-row items-center mt-1">
              <View className={`w-2 h-2 rounded-full ${getExpiryColor()} mr-2`} />
              <Text className="text-gray-500 text-xs">
                Expires: {new Date(item.expiry_date).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>

        {/* Actions */}
        <View className="flex-row gap-2">
          <TouchableOpacity
            className="bg-blue-500/80 backdrop-blur-sm px-3 py-2 rounded-lg"
            onPress={() => onEdit(item)}
          >
            <Text className="text-white text-xs font-semibold">✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-red-500/80 backdrop-blur-sm px-3 py-2 rounded-lg"
            onPress={() => onRemove(item.id)}
          >
            <Text className="text-white text-xs font-semibold">🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
