import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import Slider from "@react-native-community/slider";
import { sound } from "@/lib/utils";

const AnimatedSlider = Animated.createAnimatedComponent(Slider);

type Props = {
  curPosition: number;
  title: string;
  duration: number;
};

const MusicSlider = ({ curPosition, title, duration }: Props) => {
  const [position, setPosition] = useState<number>(curPosition);
  const sliderScale = useSharedValue(2.5);

  // Function to convert slider position to minutes and seconds
  const formatTime = (position: number) => {
    const totalSeconds = Math.floor(position);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = (totalSeconds % 60) + (position - totalSeconds);
    return `${String(minutes).padStart(2, "0")}:${String(seconds.toFixed(0)).padStart(2, "0")}`;
  };

  useEffect(() => {
    function updatePosition() {
      sound.setOnPlaybackStatusUpdate((status: any) => {
        // Update every 2 seconds
        setPosition(status.positionMillis / 1000);
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
        value={position}
        minimumTrackTintColor="white"
        maximumTrackTintColor="gray"
        thumbTintColor="rgba(52, 52, 52, 0)"
        onSlidingComplete={(value) => {
          sliderScale.value = withTiming(2.5, { duration: 100 });
          setPosition(value);
          sound.setPositionAsync(value * 1000);
        }}
      />
      <View className="flex flex-row items-center justify-between mt-2 mx-4">
        <Text className="text-white">{formatTime(position)}</Text>
        <Text className="text-white">{formatTime(duration)}</Text>
      </View>
    </View>
  );
};

export default MusicSlider;
