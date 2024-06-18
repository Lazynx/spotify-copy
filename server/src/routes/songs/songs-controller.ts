import { Request, Response } from 'express';
import SongsService from './songs-service';
import multer from 'multer';
import * as path from 'path';

const upload = multer({ dest: 'uploads/' });

class songsController {
  private songsService: SongsService;

  constructor(songsService: SongsService) {
    this.songsService = songsService;
  }

  createSong = async (req: Request, res: Response): Promise<void> => {
    try {
      const songData = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const songFile = files['song'] ? files['song'][0] : null;
      const imageFile = files['image'] ? files['image'][0] : null;

      console.log('Received song data:', songData);
      console.log('Received song file:', songFile);
      console.log('Received image file:', imageFile);

      if (!songFile) {
        res.status(400).json({ message: 'Song file is required' });
        return;
      }

      const newSong = await this.songsService.createSong(
        songData,
        songFile.buffer,
        songFile.originalname,
        imageFile ? imageFile.buffer : undefined,
        imageFile ? imageFile.originalname : undefined
      );

      res.status(201).json(newSong);
    } catch (error) {
      console.error('Error creating song:', error);
      res.status(500).json({ message: 'Error creating song', error });
    }
  };

  getSong = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      console.log(`Fetching song with id: ${id}`);
      const song = await this.songsService.getSong(id);

      if (song) {
        res.status(200).json(song);
      } else {
        res.status(404).json({ message: 'Song not found' });
      }
    } catch (err) {
      console.error('Error getting song:', err);
      res.status(500).json({ message: 'Error getting song', error: err });
    }
  };

  getAllSongs = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('Fetching all songs');
      const songs = await this.songsService.getAllSongs();
      res.status(200).json(songs);
    } catch (err) {
      console.error('Error getting songs:', err);
      res.status(500).json({ message: 'Error getting songs', error: err });
    }
  };

  deleteSong = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const song = await this.songsService.deleteSong(id);

      if (song) {
        res.status(200).json(song);
      } else {
        res.status(404).json({ message: 'Song not found' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Error deleting song' });
    }
  };

  getAllArtists = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('Fetching all artists');
      const artists = await this.songsService.getAllArtists();
      res.status(200).json(artists);
    } catch (err) {
      console.error('Error getting artists:', err);
      res.status(500).json({ message: 'Error getting artists', error: err });
    }
  };

  getSongsByArtist = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const songs = await this.songsService.getSongsByArtist(id);
      res.status(200).json(songs);
    } catch (err) {
      res.status(500).json({ message: 'Error getting songs by artist' });
    }
  };

  getArtistById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const artist = await this.songsService.getArtistById(id);
      res.status(200).json(artist);
    } catch (err) {
      res.status(500).json({ message: 'Error getting songs by artist' });
    }
  };
}

// const songsService = new SongsService();
// const songsController = new SongsController(songsService);

export default songsController;
