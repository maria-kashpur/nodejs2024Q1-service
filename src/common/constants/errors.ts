const appError = {
  USER_ID_NOT_EXIST: 'User with this id not exist',
  TRACK_ID_NOT_EXIST: 'Track with this id not exist',
  ALBUM_ID_NOT_EXIST: 'Album with this id not exist',
  ARTIST_ID_NOT_EXIST: 'Artist with this id not exist',
  UPDATE_USER_PASSWORD_INVALID: 'oldPassword is wrong',
  INVALID_SOURSE:
    'Invalid source: use /favs/album/:id, /favs/artist/:id or /favs/track/:id',
  NOT_FOUND_FAVS_ARTIST:
    'The artist is not included in favorites',
  NOT_FOUND_FAVS_ALBUM: 'The album is not included in favorites',
  NOT_FOUND_FAVS_TRACK: 'The track is not included in favorites',
};

export default appError;
