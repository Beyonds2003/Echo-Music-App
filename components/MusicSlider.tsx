import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import Slider from "@react-native-community/slider";
import TrackPlayer, { useProgress } from "react-native-track-player";

const AnimatedSlider = Animated.createAnimatedComponent(Slider);

type Props = {
  curPosition: number;
  title: string;
  duration: number;
};

const MusicSlider = ({ curPosition, title, duration }: Props) => {
  const [position, setPosition] = useState<number>(curPosition);
  const progress = useProgress();

  const sliderScale = useSharedValue(2.5);

  // Function to convert slider position to minutes and seconds
  const formatTime = (position: number) => {
    const totalSeconds = Math.floor(position);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = (totalSeconds % 60) + (position - totalSeconds);
    return `${String(minutes).padStart(2, "0")}:${String(seconds.toFixed(0)).padStart(2, "0")}`;
  };

  return (
    <View className="mt-5">
      <AnimatedSlider
        className="w-full"
        style={{
          transform: [{ scaleY: sliderScale }],
        }}
        onSlidingStart={() => {
          sliderScale.value = withTiming(4, { duration: 100 });
        }}
        maximumValue={duration}
        value={progress.position}
        minimumTrackTintColor="white"
        maximumTrackTintColor="gray"
        thumbTintColor="rgba(52, 52, 52, 0)"
        onSlidingComplete={async (value) => {
          sliderScale.value = withTiming(2.5, { duration: 100 });
          setPosition(value);
          await TrackPlayer.seekTo(value);
        }}
      />
      <View className="flex flex-row items-center justify-between mt-2 mx-4">
        <Text className="text-white">{formatTime(progress.position)}</Text>
        <Text className="text-white">{formatTime(duration)}</Text>
      </View>
    </View>
  );
};

export default MusicSlider;
