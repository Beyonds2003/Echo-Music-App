import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { useMusicPlayerStore } from "@/constants/musicPlayerStore";
import { handleMusicPause, handleMusicPlay, sound } from "@/lib/utils";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LyricBottomSheet from "@/components/LyricBottomSheet";
import MusicSlider from "@/components/MusicSlider";

const Detail = () => {
  const params = useLocalSearchParams();

  const musicPlayerStore = useMusicPlayerStore((state) => state);
  const { id, image, title, artist, url, duration, isPlayed, bgColor } =
    musicPlayerStore;

  return (
    <SafeAreaView className="flex-1 ">
      <GestureHandlerRootView>
        <LinearGradient
          className="flex-1 p-10 px-6"
          colors={[`${bgColor[4]}`, `${bgColor[1]}`, "#111827"]}
          locations={[0, 0.4, 1]}
        >
          {/* Header */}
          <View className="flex flex-row items-center justify-between">
            <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
              <FontAwesome6 name="chevron-down" size={26} color="white" />
            </TouchableOpacity>
            <Text
              className="font-semibold w-[200px] text-center text-2xl text-white"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <FontAwesome6 name="ellipsis" size={26} color="white" />
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
            <View className="mt-20 ml-5">
              <Text className="text-2xl font-semibold text-white">{title}</Text>
              <Text className="text-gray-300 mt-1">{artist}</Text>
            </View>
            <MusicSlider
              curPosition={Number(params.position)}
              title={title}
              duration={duration}
            />
            <View className="flex items-center justify-center mt-8">
              <View className="flex flex-row items-center gap-20">
                <TouchableOpacity>
                  <MaterialIcons name="skip-previous" size={30} color="white" />
                </TouchableOpacity>
                <TouchableOpacity>
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
                      <FontAwesome6 name="pause" size={28} color="white" />
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
                      <FontAwesome6 name="play" size={28} color="white" />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
                <TouchableOpacity>
                  <MaterialIcons name="skip-next" size={30} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <LyricBottomSheet title={title} artist={artist} />
        </LinearGradient>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default Detail;
