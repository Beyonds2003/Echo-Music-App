import { View, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useMusicSearchStore } from "@/constants/musicSearchStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TrackPlayer, { Capability } from "react-native-track-player";

const SearchInput = () => {
  const musicSearchStore = useMusicSearchStore((state) => state);
  const [value, setValue] = useState(musicSearchStore.name);

  useEffect(() => {
    const updateOption = async () => {
      await TrackPlayer.updateOptions({
        alwaysPauseOnInterruption: true,
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.Stop,
        ],
        notificationCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
      });
    };
    updateOption();
  }, []);
  return (
    <View className="flex flex-row items-center space-x-4 bg-gray-100 p-2 rounded-xl">
      <AntDesign name="search1" size={24} color="black" />
      <TextInput
        placeholder="Search"
        className="flex-1 "
        selectionColor={"gray"}
        value={value}
        onChangeText={(text) => setValue(text)}
        onSubmitEditing={async () => {
          await AsyncStorage.setItem("musicSearch", value);
          musicSearchStore.set(value);
          setValue("");
        }}
      />
    </View>
  );
};

export default SearchInput;
