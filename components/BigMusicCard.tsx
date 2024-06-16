import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { handleMusicPlay } from "@/lib/utils";
import { useMusicPlayerStore } from "@/constants/musicPlayerStore";

type Props = {
  id: string;
  image: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
};

const BigMusicCard = ({ id, image, title, artist, url, duration }: Props) => {
  const musicPlayerStore = useMusicPlayerStore((state) => state);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
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
      className="mr-4"
    >
      <Image src={image} className="w-48 h-48 bg-black rounded-[30px]" />
      <View className="ml-2">
        <Text
          className="text-lg font-semibold w-[170px]"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
        <Text className="text-gray-500">{artist}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default BigMusicCard;
