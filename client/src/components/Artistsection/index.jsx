import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { ArtistsCard } from "../ArtistsCard";
import "./Artistsection.css";

export const Artistsection = ({ title }) => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/songs/artists`);
        setArtists(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching artists');
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);

  if (loading) {
    return <p className="text-center text-white">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-8">
        <Link to="/" className="text-2xl font-bold text-white hover:underline">
          Popular artists
        </Link>
        <Link
          to="/"
          className="text-sm font-bold tracking-[2px] hover:underline"
        >
          Show all
        </Link>
      </div>
      <div className="horizontal-scroll grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {artists.map((artist, index) => (
          <ArtistsCard
            key={artist._id}
            id={artist._id}
            title={artist.name}
            description={artist.description || "No description"}
            imageUrl={artist.photo || "No photo available"} 
          />
        ))}
      </div>
    </div>
  );
};
