import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";

export let sound = new Audio.Sound();
let isSoundLoaded = false;
let musicId = "";

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
  console.log("play");
  try {
    const status = await sound.getStatusAsync();
    if (status.isLoaded) {
      if (musicId === id && !status.isPlaying) {
        // Resume the current sound if it is paused and the same song
        await sound.playAsync();
      } else {
        // Unload any previously loaded sound
        sound.unloadAsync();
        sound = new Audio.Sound();
        await sound.loadAsync({ uri: url });
        isSoundLoaded = true;
        musicId = id;

        // Play the new sound
        await sound.playAsync();
      }
    } else {
      // Create a new sound instance and load the new sound
      sound = new Audio.Sound();
      await sound.loadAsync({ uri: url });
      isSoundLoaded = true;
      musicId = id;

      // Play the new sound
      await sound.playAsync();
    }

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
    if (isSoundLoaded) {
      console.log("pause");
      await sound.pauseAsync();
      setMusicStore({
        id,
        title,
        artist,
        duration,
        url,
        image,
        isPlayed: false,
      });
    } else {
      console.log("Sound is not loaded, cannot pause.");
    }
  } catch (error) {
    console.log(error);
  }
};
