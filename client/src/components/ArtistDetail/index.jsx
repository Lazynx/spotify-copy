import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';

export const ArtistDetail = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtistDetails = async () => {
      try {
        const artistResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/songs/artists/${id}`);
        const songsResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/songs/artists/${id}/songs`);
        
        setArtist(artistResponse.data);
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
    <div className="mb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">{artist.name}</h1>
        <p className="text-gray-400">{artist.description || "No description available"}</p>
        {artist.photo && <img src={artist.photo} alt={artist.name} className="w-48 h-48 rounded-full drop-shadow-2xl" />}
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Songs</h2>
        {songs.length > 0 ? (
          <ul>
            {songs.map((song) => (
              <li key={song._id} className="text-gray-300 mb-2">{song.title}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No songs available for this artist.</p>
        )}
      </div>
    </div>
  );
};
