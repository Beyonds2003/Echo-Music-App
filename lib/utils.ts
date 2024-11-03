import AsyncStorage from "@react-native-async-storage/async-storage";
import TrackPlayer from "react-native-track-player";

let isSetUp: boolean = false;
let musicId: string = "";

type musicType = {
  id: string;
  image: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  isPlayed: boolean;
};

export const handleMusicPlay = async (
  id: string,
  image: string,
  title: string,
  artist: string,
  url: string,
  duration: number,
  setMusicStore: (data: musicType) => void,
) => {
  try {
    if (!isSetUp) {
      await TrackPlayer.setupPlayer();
      isSetUp = true;
    }
    if (musicId !== id) {
      await TrackPlayer.reset();
    }
    await TrackPlayer.add({
      id,
      url,
      title,
      artist,
      artwork: image,
      duration,
    });
    await TrackPlayer.play();

    musicId = id;

    // Update Store
    setMusicStore({
      id,
      title,
      artist,
      duration,
      url,
      image,
      isPlayed: true,
    });

    // Get and Add to Async Storage
    const storedMusic = (await AsyncStorage.getItem("music")) ?? "[]";
    const parsedMusic = JSON.parse(storedMusic);
    if (!parsedMusic.some((music: any) => music.id === id)) {
      if (parsedMusic.length > 4) {
        parsedMusic.pop();
      }
      parsedMusic.unshift({ id, image, title, artist, url, duration });
      await AsyncStorage.setItem("music", JSON.stringify(parsedMusic));
    }
  } catch (error) {
    console.log(error);
  }
};

export const handleMusicPause = async (
  id: string,
  image: string,
  title: string,
  artist: string,
  url: string,
  duration: number,
  setMusicStore: (data: musicType) => void,
) => {
  try {
    console.log("pause");
    await TrackPlayer.pause();
    setMusicStore({
      id,
      title,
      artist,
      duration,
      url,
      image,
      isPlayed: false,
    });
  } catch (error) {
    console.log(error);
  }
};
