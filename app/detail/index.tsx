import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { useMusicPlayerStore } from "@/constants/musicPlayerStore";
import Slider from "@react-native-community/slider";
import { sound } from "@/lib/utils";
import { router } from "expo-router";

const Detail = () => {
  const [position, setPosition] = useState(0);

  const musicPlayerStore = useMusicPlayerStore((state) => state);
  const { id, image, title, artist, url, duration, isPlayed } =
    musicPlayerStore;

  useEffect(() => {
    function updatePosition() {
      sound.setOnPlaybackStatusUpdate((status: any) => {
        // Update every 2 seconds
        setPosition(status.positionMillis / 1000),
          console.log(status.positionMillis / 1000, "Position");
      });
    }
    let interval = setTimeout(updatePosition, 1000);
    // Cleanup function to avoid memory leaks
    return () => {
      sound.setOnPlaybackStatusUpdate(null);
      clearTimeout(interval);
    };
  }, [position, title]);

  return (
    <SafeAreaView className="flex-1 bg-white p-10 px-6">
      {/* Header */}
      <View className="flex flex-row items-center justify-between">
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
          <FontAwesome6 name="chevron-down" size={26} color="black" />
        </TouchableOpacity>
        <Text className="font-semibold text-xl">{title}</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <FontAwesome6 name="ellipsis" size={26} color="black" />
        </TouchableOpacity>
      </View>

      {/* Music Player */}
      <View className="flex-1 justify-center">
        <View className=" flex items-center">
          <Image
            src={image}
            alt="music profile image"
            className="w-[300px] h-[300px] object-cover"
          />
        </View>
        <View className="mt-4 ml-8">
          <Text className="text-2xl font-semibold">{title}</Text>
          <Text className="text-gray-500">{artist}</Text>
        </View>
        <View className="mt-4">
          <Slider
            className="w-full"
            maximumValue={duration}
            value={position}
            minimumTrackTintColor="black"
            maximumTrackTintColor="gray"
            thumbTintColor="#FFFFFF"
            onSlidingComplete={(value) => {
              setPosition(value);
              sound.setPositionAsync(value * 1000);
            }}
          />
        </View>
        <View className="flex items-center justify-center mt-8">
          <View className="flex flex-row items-center gap-20">
            <TouchableOpacity>
              <MaterialIcons name="skip-previous" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity>
              {isPlayed ? (
                <FontAwesome6 name="pause" size={28} color="black" />
              ) : (
                <FontAwesome6 name="play" size={28} color="black" />
              )}
            </TouchableOpacity>
            <TouchableOpacity>
              <MaterialIcons name="skip-next" size={30} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Detail;
