export const MUSIC_URL = "https://saavn.dev/api";

export interface SongSearchResponse {
  success: boolean; // Indicates whether the song search was successful
  data: {
    total: number;
    start: number;
    results: Array<{
      id: string;
      name: string;
      type: string;
      year: string | null;
      releaseDate: string | null;
      duration: number | null;
      label: string | null;
      explicitContent: boolean;
      playCount: number | null;
      language: string;
      hasLyrics: boolean;
      lyricsId: string | null;
      lyrics: {
        lyrics: string;
        copyright: string;
        snippet: string;
      };
      url: string;
      copyright: string | null;
      album: {
        id: string | null;
        name: string | null;
        url: string | null;
      };
      artists: {
        primary: Array<{
          id: string;
          name: string;
          role: string;
          type: string;
          image: Array<{
            quality: string;
            url: string;
          }>;
          url: string;
        }>;
        featured: Array<{
          id: string;
          name: string;
          role: string;
          type: string;
          image: Array<{
            quality: string;
            url: string;
          }>;
          url: string;
        }>;
        all: Array<{
          id: string;
          name: string;
          role: string;
          type: string;
          image: Array<{
            quality: string;
            url: string;
          }>;
          url: string;
        }>;
      };
      image: Array<{
        quality: string;
        url: string;
      }>;
      downloadUrl: Array<{
        quality: string;
        url: string;
      }>;
    }>;
  };
}
