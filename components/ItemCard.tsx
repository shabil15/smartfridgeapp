import { FridgeItem } from '@/lib/supabase';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
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
    <BlurView
      intensity={15}
      tint="light"
      className="rounded-2xl overflow-hidden border border-white/20 mb-3"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
    >
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
        className="p-4"
      >
        <View className="flex-row items-center">
          {/* Category Icon */}
          <BlurView
            intensity={10}
            tint="light"
            className="w-12 h-12 rounded-full overflow-hidden border border-white/20 items-center justify-center mr-3"
            style={{ backgroundColor: 'rgba(168, 85, 247, 0.2)' }}
          >
            <Text className="text-2xl">{getCategoryEmoji(item.category)}</Text>
          </BlurView>

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
              activeOpacity={0.7}
              onPress={() => onEdit(item)}
            >
              <BlurView
                intensity={10}
                tint="light"
                className="rounded-lg overflow-hidden border border-white/20"
                style={{ backgroundColor: 'rgba(59, 130, 246, 0.3)' }}
              >
                <View className="px-3 py-2">
                  <Text className="text-xs font-semibold">✏️</Text>
                </View>
              </BlurView>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onRemove(item.id)}
            >
              <BlurView
                intensity={10}
                tint="light"
                className="rounded-lg overflow-hidden border border-white/20"
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.3)' }}
              >
                <View className="px-3 py-2">
                  <Text className="text-xs font-semibold">🗑️</Text>
                </View>
              </BlurView>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </BlurView>
  );
}
