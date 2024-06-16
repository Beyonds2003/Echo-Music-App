import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import BigMusicCard from "./BigMusicCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMusicPlayerStore } from "@/constants/musicPlayerStore";
import { FontAwesome6 } from "@expo/vector-icons";

const RecentlyPlayed = () => {
  const [recentlyPlayed, setRecentlyPlayed] = React.useState([]);
  const musicPlayerStore = useMusicPlayerStore((state) => state);
  const { id, image, title, artist, url, duration } = musicPlayerStore;

  const [showMore, setShowMore] = React.useState<boolean>(true);

  useEffect(() => {
    async function getRecentlyPlayed() {
      const data = (await AsyncStorage.getItem("music")) ?? "[]";
      const parsedMusic = JSON.parse(data);
      if (id !== "") {
        if (!parsedMusic.some((music: any) => music.id === id)) {
          if (parsedMusic.length > 4) {
            parsedMusic.pop();
          }
          parsedMusic.unshift({ id, image, title, artist, url, duration });
        }
      }
      setRecentlyPlayed(parsedMusic);
    }
    getRecentlyPlayed();
  }, [title]);

  return (
    <View>
      {recentlyPlayed.length > 0 && (
        <View className="mt-4">
          <View className="flex flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-semibold">Recently Played</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              className="border-[1px] border-gray-400 p-2 rounded-full"
              onPress={() => setShowMore(!showMore)}
            >
              {!showMore ? (
                <FontAwesome6 name="chevron-down" size={18} color="black" />
              ) : (
                <FontAwesome6 name="chevron-up" size={18} color="black" />
              )}
            </TouchableOpacity>
          </View>
          {showMore && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recentlyPlayed.map((song: any, index) => (
                <BigMusicCard key={index} {...song} />
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
};

export default RecentlyPlayed;
