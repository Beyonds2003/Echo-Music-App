import { View, Text, ScrollView } from "react-native";
import React from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";

type Props = {
  title: string;
  artist: string;
};

const LyricBottomSheet = ({ title, artist }: Props) => {
  const snapPoints = React.useMemo(() => ["6%", "89%"], []);
  const sheetRef = React.useRef<BottomSheet>(null);

  const { data: lyric, isLoading } = useQuery({
    queryKey: [title, artist],
    queryFn: async (): Promise<{ message: string }> => {
      const response = await fetch(
        `https://echo-lyrics-hono-server.addy23.workers.dev/${artist}/${title}`,
      );
      if (response.status === 200) {
        const data: { message: string } = await response.json();
        return data;
      }
      return { message: "Not Found" };
    },
  });

  return (
    <BottomSheet
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enableContentPanningGesture={false}
      handleIndicatorStyle={{
        backgroundColor: "white",
      }}
      handleStyle={{
        backgroundColor: "#111827",
        borderColor: "#111827",
        borderWidth: 4,
      }}
    >
      <View className={`flex-1 `} style={{ backgroundColor: "#111827" }}>
        <ScrollView
          className="p-10 pt-4 flex-1 "
          contentContainerStyle={{ paddingBottom: 70 }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-white text-2xl text-center mb-10 mr-1">
            Lyrics
          </Text>

          {!lyric || isLoading ? (
            <View className="flex-1 mt-64 justify-center items-center">
              <Text className="text-white text-lg">Loading...</Text>
            </View>
          ) : (
            <Text className="text-white text-base">{lyric.message}</Text>
          )}
        </ScrollView>
      </View>
    </BottomSheet>
  );
};

export default LyricBottomSheet;
