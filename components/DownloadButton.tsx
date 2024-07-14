import { View, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { AntDesign } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Alert } from "react-native";
import Svg, { Circle } from "react-native-svg";

type Props = {
  id: string;
  image: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
};

const DownloadButton = ({ id, image, title, artist, url, duration }: Props) => {
  const [downloadProgess, setDownloadProgress] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [downloadResumable, setDownloadResumable] =
    useState<FileSystem.DownloadResumable | null>(null);

  const borderWidth = useSharedValue(100);

  const handleDownload = async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    setIsPaused(false);

    // Request permissions to access media library
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Cannot save file without permission.");
      setIsDownloading(false);
      return;
    }

    // Create a download resumable to a temporary directory
    const tmpFileUri = FileSystem.cacheDirectory + `${title}.mp3`;
    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      tmpFileUri,
      {},
      (progress: FileSystem.DownloadProgressData) => {
        const pro =
          progress.totalBytesWritten / progress.totalBytesExpectedToWrite;
        console.log(pro * 100, "Progress: ");
        setDownloadProgress(pro * 100);
      },
    );
    setDownloadResumable(downloadResumable);
    try {
      const { uri }: any = await downloadResumable.downloadAsync();

      console.log("URI: ", uri);
      // Save the file to the public Downloads folder
      const asset = await MediaLibrary.createAssetAsync(uri);
      console.log("Asset: ", asset);
      // const album = await MediaLibrary.getAlbumAsync("Music");
      // if (album === null) {
      //   await MediaLibrary.createAlbumAsync("Music", asset, true);
      // } else {
      //   await MediaLibrary.addAssetsToAlbumAsync([asset], album, true);
      // }

      console.log(`File moved to public Music folder`);

      setIsDownloading(false);
      setDownloadProgress(0);
    } catch (error) {
      console.log("Download Error: ", error);
      Alert.alert(
        "Download Failed",
        "An error occurred while downloading the file.",
      );

      setIsDownloading(false);
    }
  };

  const handleDownloadPause = async () => {
    if (downloadResumable) {
      try {
        await downloadResumable.pauseAsync();
        setIsPaused(true);
      } catch (e) {
        Alert.alert(
          "Pause Failed",
          "An error occurred while pausing the download.",
        );
      }
    }
  };

  const handleDownloadResume = async () => {
    if (downloadResumable) {
      try {
        await downloadResumable.resumeAsync();
        setIsPaused(false);
      } catch (e) {
        Alert.alert(
          "Resume Failed",
          "An error occurred while resuming the download.",
        );
      }
    }
  };

  useEffect(() => {
    borderWidth.value = withTiming(downloadProgess, { duration: 500 });
  }, [downloadProgess]);

  return (
    <View className="mt-4">
      {isDownloading ? (
        <View>
          <TouchableOpacity
            activeOpacity={0.7}
            className="relative"
            onPress={isPaused ? handleDownloadResume : handleDownloadPause}
          >
            <Svg width={43} height={43} viewBox="0 0 100 100">
              <Circle
                cx="50"
                cy="50"
                r="45"
                stroke="gray"
                strokeWidth="3"
                fill="none"
                strokeDasharray={100 * Math.PI}
                transform="rotate(-90 50 50)"
                strokeDashoffset={100 * Math.PI * (1 - downloadProgess / 100)}
              />
            </Svg>
            <View className="absolute top-[40%] right-[36%] w-[12px] h-[12px] bg-black" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={handleDownload}
          activeOpacity={0.7}
          className="border-gray-400 border-[1px] p-[10px] rounded-full"
        >
          <AntDesign name="download" size={18} color="black" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default DownloadButton;
