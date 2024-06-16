import { View, Text, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import SmallMusicCard from "./SmallMusicCard";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { MUSIC_URL, SongSearchResponse } from "@/constants";
import { useMusicSearchStore } from "@/constants/musicSearchStore";
import { FlashList } from "@shopify/flash-list";

const SearchSong = () => {
  const musicSearchStore = useMusicSearchStore((state) => state);
  const [page, setPage] = useState(1);

  const fetchSongs = async ({ pageParam = page }: { pageParam: number }) => {
    console.log("Fetch page: ", pageParam);
    const response = await fetch(
      `${MUSIC_URL}/search/songs?page=${pageParam}&limit=10&query=${musicSearchStore.name === "" ? "Suzume" : musicSearchStore.name}`,
    );
    const data = await response.json();
    return data;
  };

  const {
    data: search,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isPending,
  } = useInfiniteQuery({
    queryKey: ["search-song", musicSearchStore.name],
    queryFn: fetchSongs,
    getNextPageParam: (lastPage: SongSearchResponse) => {
      console.log(lastPage.data.start, "Last Page: ", lastPage.data.total);
      return lastPage.data.start + 10 < lastPage.data.total
        ? page + 1
        : undefined;
    },
    initialPageParam: 1,
  });

  const handleLoadMore = () => {
    console.log("Has Next Page: ", hasNextPage);
    if (hasNextPage) {
      setPage((prevPage) => prevPage + 1);
      fetchNextPage();
      console.log("Load More");
    }
  };

  if (isPending) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-semibold">Loading</Text>
      </View>
    );
  }

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="flex justify-center items-center p-2">
        <ActivityIndicator size="large" />
      </View>
    );
  };

  return (
    <View className="flex-1">
      <Text className="text-2xl font-semibold mb-3">Search</Text>
      <FlashList
        className="flex-1"
        showsVerticalScrollIndicator={false}
        data={search?.pages.flatMap((page: any) => page.data.results)}
        renderItem={({ item: song }: any) => {
          return (
            <SmallMusicCard
              key={song.id}
              id={song.id}
              image={song.image[2].url}
              title={song.name}
              artist={song.artists.primary[0].name}
              url={song.downloadUrl[2].url}
              duration={song.duration ?? 0}
            />
          );
        }}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        estimatedItemSize={100}
      />
    </View>
  );
};

export default SearchSong;
