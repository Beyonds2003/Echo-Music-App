import { View, TextInput } from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useMusicSearchStore } from "@/constants/musicSearchStore";

const SearchInput = () => {
  const musicSearchStore = useMusicSearchStore((state) => state);
  const [value, setValue] = useState(musicSearchStore.name);
  return (
    <View className="flex flex-row items-center space-x-4 bg-gray-100 p-2 rounded-xl">
      <AntDesign name="search1" size={24} color="black" />
      <TextInput
        placeholder="Search"
        className="flex-1 "
        selectionColor={"gray"}
        value={value}
        onChangeText={(text) => setValue(text)}
        onSubmitEditing={() => {
          musicSearchStore.set(value);
          setValue("");
        }}
      />
    </View>
  );
};

export default SearchInput;
