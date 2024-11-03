import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useMusicPlayerStore } from "@/constants/musicPlayerStore";
import { handleMusicPause, handleMusicPlay } from "@/lib/utils";
import Slider from "@react-native-community/slider";
import { router } from "expo-router";
import ImageColors from "react-native-image-colors";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import TrackPlayer, { useProgress } from "react-native-track-player";

const AnimatedSlider = Animated.createAnimatedComponent(Slider);

const BottomMusicBar = () => {
  const [position, setPosition] = useState(0);

  const musicPlayerStore = useMusicPlayerStore((state) => state);
  const progress = useProgress();

  const { id, title, artist, duration, url, image, isPlayed } =
    musicPlayerStore;

  const sliderScale = useSharedValue(2.5);

  useEffect(() => {
    const generateBgColor = async () => {
      const result: any = await ImageColors.getColors(image, {
        fallback: "#111827",
        cache: false,
        key: "unique_key",
        quality: "highest",
      });
      musicPlayerStore.set({
        bgColor: [
          result.average,
          result.darkMuted,
          result.darkVibrant,
          result.dominant,
          result.lightMuted,
          result.lightVibrant,
        ],
      });
    };
    generateBgColor();
  }, [title]);

  return (
    <View className="absolute bg-white rounded-xl overflow-hidden shadow-lg shadow-gray-500 bottom-2 left-0 right-0 mx-2  p-3">
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          router.push({ pathname: "/detail", params: { position } });
        }}
        className="flex flex-row items-center justify-between"
      >
        <View className="flex flex-row gap-4">
          <Image src={image} className="w-16 h-16 rounded-full" />
          <View>
            <View className="flex flex-row justify-between items-center flex-1 relative">
              <View>
                <Text
                  className="text-lg font-semibold w-[165px]"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {title}
                </Text>
                <Text className="text-gray-500 mb-3">{artist}</Text>
              </View>
              <View className="flex flex-row items-center gap-4">
                <TouchableOpacity>
                  <MaterialIcons name="skip-previous" size={30} color="black" />
                </TouchableOpacity>
                {isPlayed ? (
                  <TouchableOpacity
                    onPress={() =>
                      handleMusicPause(
                        id,
                        image,
                        title,
                        artist,
                        url,
                        duration,
                        musicPlayerStore.set,
                      )
                    }
                  >
                    <FontAwesome6 name="pause" size={28} color="black" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() =>
                      handleMusicPlay(
                        id,
                        image,
                        title,
                        artist,
                        url,
                        duration,
                        musicPlayerStore.set,
                      )
                    }
                  >
                    <FontAwesome6 name="play" size={28} color="black" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity>
                  <MaterialIcons name="skip-next" size={30} color="black" />
                </TouchableOpacity>
              </View>
            </View>
            <View className="w-full h-2 ml-[-10px]">
              <AnimatedSlider
                className="w-full"
                onSlidingStart={() => {
                  sliderScale.value = withTiming(4, { duration: 100 });
                }}
                maximumValue={duration}
                value={progress.position}
                minimumTrackTintColor="black"
                maximumTrackTintColor="gray"
                thumbTintColor="rgba(52, 52, 52, 1)"
                onSlidingComplete={async (value) => {
                  sliderScale.value = withTiming(2.5, { duration: 100 });
                  setPosition(value);
                  await TrackPlayer.seekTo(value);
                }}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default BottomMusicBar;
