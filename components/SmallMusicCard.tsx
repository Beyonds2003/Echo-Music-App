import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useMusicPlayerStore } from "@/constants/musicPlayerStore";
import { FontAwesome6 } from "@expo/vector-icons";
import { handleMusicPause, handleMusicPlay } from "@/lib/utils";
import DownloadButton from "./DownloadButton";

type Props = {
  id: string;
  image: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
};

const SmallMusicCard = ({ id, image, title, artist, url, duration }: Props) => {
  const musicPlayerStore = useMusicPlayerStore((state) => state);

  return (
    <View className="flex flex-row items-center justify-between my-2">
      <View className="flex flex-row gap-4 items-center">
        <Image src={image} className="w-16 h-16 rounded-2xl" />
        <View className="flex flex-col mb-2">
          <Text
            className="text-lg font-semibold w-[170px]"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
          <Text className="text-gray-500 mt-1">{artist}</Text>
        </View>
      </View>
      <View className="flex flex-row items-center  gap-4">
        {/* Download Button */}
        <DownloadButton
          id={id}
          image={image}
          title={title}
          artist={artist}
          url={url}
          duration={duration}
        />
        {/* Play, Pause Button */}
        <View>
          {musicPlayerStore.isPlayed && musicPlayerStore.id === id ? (
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
              activeOpacity={0.7}
              className="border-gray-400 border-[1px] w-10 h-10 flex items-center justify-center rounded-full"
            >
              <FontAwesome6 name="pause" size={18} color="black" />
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
              activeOpacity={0.7}
              className="border-gray-400 border-[1px] w-10 h-10 flex items-center justify-center rounded-full"
            >
              <FontAwesome6 name="play" size={14} color="black" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default SmallMusicCard;
