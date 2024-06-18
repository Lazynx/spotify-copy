import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import Header from "../../components/Header";
import { usePlayer } from "../../context/PlayerContext";
import Sidebar from "../../components/Sidebar";
import { Footer } from "../../components/footer";

export const ArtistDetail = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { playSong } = usePlayer();

  useEffect(() => {
    const fetchArtistDetails = async () => {
      try {
        const artistResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/songs/artists/${id}`);
        const songsResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/songs/artists/${id}/songs`);
        
        setArtist(artistResponse.data);
        console.log(songsResponse.data);
        setSongs(songsResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching artist details');
        setLoading(false);
      }
    };
    fetchArtistDetails();
  }, [id]);

  if (loading) {
    return <p className="text-center text-white">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen text-gray-300">
      <Header setShowSidebar={setShowSidebar} />
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <div className="bg-custom-section pt-28 md:pl-72 p-8">
        <div className="artist-detail mb-8 ">
        <div className="artist-info mb-8 flex items-center flex-col">
            <h1 className="text-3xl font-bold text-white pb-5">{artist.name}</h1>
            {artist.photo && <img src={artist.photo} alt={artist.name} className="w-48 h-48 rounded-full drop-shadow-2xl" />}
        </div>
        <div className="artist-songs">
            <h2 className="text-2xl font-bold text-white mb-4">Songs</h2>
            {songs.length > 0 ? (
              <ul>
                {songs.map((song) => (
                  <li key={song._id} className="text-gray-300 mb-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {song.image && <img src={song.image} alt={song.title} className="w-16 h-16 rounded" />}
                      <div>
                        <h3 className="text-lg font-bold text-white">{song.title}</h3>
                        <p className="text-sm text-gray-400">{song.artist}</p>
                        {song.album && <p className="text-sm text-gray-400">{song.album}</p>}
                        {song.genre && <p className="text-sm text-gray-400">{song.genre}</p>}
                        {song.year && <p className="text-sm text-gray-400">{song.year}</p>}
                        {song.duration && <p className="text-sm text-gray-400">{song.duration} mins</p>}
                      </div>
                    </div>
                    <button
                      className="ml-4 p-2 bg-green-500 rounded text-black flex-end"
                      onClick={() => playSong(song)}
                    >
                      Play
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No songs available for this artist.</p>
            )}
        </div>
        </div>
        <Footer></Footer>
        </div>
    </div>
  );
};
