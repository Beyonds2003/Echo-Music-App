import React from "react";
import { StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomMusicBar from "@/components/BottomMusicBar";
import RecentlyPlayed from "@/components/RecentlyPlayed";
import SearchSong from "@/components/SearchSong";
import { useMusicPlayerStore } from "@/constants/musicPlayerStore";
import SearchInput from "@/components/SearchInput";

const App = () => {
  const musicPlayerStore = useMusicPlayerStore((state) => state);

  return (
    <SafeAreaView className="p-4 flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <SearchInput />
      <View>
        <RecentlyPlayed />
      </View>
      <View className="mt-4 flex-1">
        <SearchSong />
      </View>
      {musicPlayerStore.id !== "" && <BottomMusicBar />}
    </SafeAreaView>
  );
};

export default App;
