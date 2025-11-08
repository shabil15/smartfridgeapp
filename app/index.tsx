import { FridgeItem, supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ImageBackground, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  const [items, setItems] = useState<FridgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [_, setStats] = useState({ total: 0, expiringSoon: 0 });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName, setUserName] = useState('Michelle');
  const [isEditingName, setIsEditingName] = useState(false);

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
    return emojis[category] || '🍲';
  };

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

  const loadUserName = async () => {
    try {
      const savedName = await AsyncStorage.getItem('userName');
      if (savedName !== null) {
        setUserName(savedName);
      }
    } catch (error) {
      console.error('Error loading user name:', error);
    }
  };

  const saveUserName = async (name: string) => {
    try {
      await AsyncStorage.setItem('userName', name);
    } catch (error) {
      console.error('Error saving user name:', error);
    }
  };

  const handleNameSave = () => {
    if (userName.trim()) {
      saveUserName(userName.trim());
      setIsEditingName(false);
    } else {
      Alert.alert('Error', 'Please enter a valid name');
    }
  };

  useEffect(() => {
    loadItems();
    loadUserName();
    
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount - intentionally omitting loadItems to prevent re-renders

  // Get greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) {
      return 'Good morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Good afternoon';
    } else if (hour >= 17 && hour < 21) {
      return 'Good evening';
    } else {
      return 'Good night';
    }
  };

  
  const getDaysUntilExpiry = (expiry_date: string | null) => {
    if (!expiry_date) return null;
    
    const today = new Date();
    const expiry = new Date(expiry_date);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysUntilExpiry;
  };

  const getExpiryText = (expiry_date: string | null) => {
    const days = getDaysUntilExpiry(expiry_date);
    if (days === null) return null;
    
    if (days < 0) {
      return `Expired ${Math.abs(days)} ${Math.abs(days) === 1 ? 'day' : 'days'} ago`;
    } else if (days === 0) {
      return 'Expires today';
    } else if (days === 1) {
      return 'Expires tomorrow';
    } else {
      return `${days} days left`;
    }
  };

  const getExpiryColor = (expiry_date: string | null) => {
    const days = getDaysUntilExpiry(expiry_date);
    if (days === null) return 'text-gray-500';
    
    if (days < 0) return 'text-red-600'; // Expired
    if (days <= 3) return 'text-orange-600'; // Expiring soon
    return 'text-green-600'; // Fresh
  };

  // Format date and time
  const formatDate = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[currentTime.getDay()]}, ${currentTime.getDate()} ${months[currentTime.getMonth()]}`;
  };

  const formatTime = () => {
    let hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr}${ampm}`;
  };

  if (loading) {
    return (
      <ImageBackground
      source={require('@/assets/images/Gemini_Generated_Image_rkl2cfrkl2cfrkl2.png')}
      className="flex-1"
      blurRadius={20}
    >
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.5)']}
          className="flex-1"
        >
          <SafeAreaView className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#FFFFFF" />
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('@/assets/images/Gemini_Generated_Image_rkl2cfrkl2cfrkl2.png')}
      className="flex-1"
      blurRadius={20}
    >
      {/* <LinearGradient
        colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.5)']}
        className="flex-1"
      > */}
        <SafeAreaView className="flex-1">
          <ScrollView className="flex-1 px-5">
            {/* Header with glassmorphism */}
            <BlurView
              intensity={20}
              tint="light"
              className="mt-4 mb-5 rounded-3xl overflow-hidden border border-white/30"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.05)']}
                className="p-6"
              >
                <View className="flex-row items-center">
                  <BlurView
                    intensity={15}
                    tint="light"
                    className="w-12 h-12 rounded-full items-center justify-center mr-3 overflow-hidden border border-white/20"
                    style={{ backgroundColor: 'rgba(99, 102, 241, 0.3)' }}
                  >
                    <Text className="text-2xl">👋</Text>
                  </BlurView>
                  <View className="flex-1">
                    <Text className="text-gray-600 text-sm">{getGreeting()},</Text>
                    {isEditingName ? (
                      <TextInput
                        value={userName}
                        onChangeText={setUserName}
                        onBlur={handleNameSave}
                        onSubmitEditing={handleNameSave}
                        autoFocus
                        className="text-gray-900 text-2xl font-bold py-0"
                        style={{ outlineWidth: 0 }}
                      />
                    ) : (
                      <TouchableOpacity onPress={() => setIsEditingName(true)}>
                        <Text className="text-gray-900 text-2xl font-bold">{userName}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </LinearGradient>
            </BlurView>

            {/* Weather/Date Card */}
            <View className="flex-row mb-5 gap-3">
              <BlurView
                intensity={15}
                tint="light"
                className="flex-1 rounded-2xl overflow-hidden border border-white/20"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <View className="p-4">
                  <Text className="text-gray-600 text-xs mb-1">{formatDate()}</Text>
                  <Text className="text-gray-900 text-xl font-bold">{formatTime()}</Text>
                </View>
              </BlurView>
              
              <BlurView
                intensity={15}
                tint="light"
                className="flex-1 rounded-2xl overflow-hidden border border-white/20"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <View className="p-4">
                  <Text className="text-gray-600 text-xs mb-1">Mostly sunny</Text>
                  <View className="flex-row items-center">
                    <Text className="text-gray-900 text-xl font-bold">18°C</Text>
                    <Text className="text-3xl ml-2">☀️</Text>
                  </View>
                </View>
              </BlurView>
            </View>

            {/* What I have in section */}
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
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-gray-900 text-xl font-bold">What I have in Fridge</Text>
                  <TouchableOpacity onPress={() => router.push('/inventory')}>
                    <Text className="text-blue-600 text-sm font-semibold">View all →</Text>
                  </TouchableOpacity>
                </View>

                {/* Items List */}
                {items.length === 0 ? (
                  <View className="justify-center items-center py-8">
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
                  </View>
                ) : (
                  items.slice(0, 4).map((item) => (
                    <BlurView
                      key={item.id}
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
                           {item.expiry_date && (
                                        <Text className={`text-xs font-medium mt-1 ${getExpiryColor(item.expiry_date)}`}>
                                          {getExpiryText(item.expiry_date)}
                                        </Text>
                                      )}
                        </View>

                        {/* Quantity */}
                        <View className="bg-white/40 rounded-full p-4">
                          <Text className="text-gray-800 text-sm font-medium">
                            {item.quantity}{item.unit}
                          </Text>
                        </View>
                      </View>
                    </BlurView>
                  ))
                )}
              </LinearGradient>
            </BlurView>

            {/* Action Buttons - Square Grid */}
            <View className="flex-row gap-4 mb-8">
              <TouchableOpacity 
                className="flex-1"
                activeOpacity={0.7}
                onPress={() => router.push('/add-item')}
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
                      <Text className="text-6xl mb-2">➕</Text>
                    </View>
                    <Text className="text-gray-900 text-center text-lg font-bold">Add Item</Text>
                    <Text className="text-gray-600 text-center text-xs mt-1">Add new items to fridge</Text>
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>

              <TouchableOpacity 
                className="flex-1"
                activeOpacity={0.7}
                onPress={() => router.push('/recipes')}
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
                      <Text className="text-6xl mb-2">✨</Text>
                    </View>
                    <Text className="text-gray-900 text-center text-lg font-bold">Recipes</Text>
                    <Text className="text-gray-600 text-center text-xs mt-1">AI-powered suggestions</Text>
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      {/* </LinearGradient> */}
    </ImageBackground>
  );
}
