// File validation rules for uploads
// Frontend can be permissive, backend will enforce stricter rules
export const ALLOWED_FILE_TYPES = {
  'audio/mpeg': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/x-wav': ['.wav'],
  'audio/mp4': ['.m4a'],
  'audio/x-m4a': ['.m4a'],
  'audio/flac': ['.flac'],
  'audio/ogg': ['.ogg'],
  'audio/webm': ['.webm'],
  'video/mp4': ['.mp4'],
  'video/webm': ['.webm'],
} as const;

// Max file size in bytes (5GB)
// export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 * 1024;

// TEMPORARY LIMIT (100MB)
export const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024;

// Max files per upload - keeping it simple
export const MAX_FILES_PER_UPLOAD = 1;

// Human readable file types
export const ALLOWED_FILE_TYPES_DISPLAY = 'MP3, WAV, M4A, FLAC, OGG, WEBM, MP4';

// Get file type icon based on extension
// TODO: do not belong here. Refactor out and delete
// export const getFileTypeIcon = (filename: string): string => {
//   const ext = filename.toLowerCase().split('.').pop();
//   if (['mp3', 'wav', 'm4a', 'flac', 'ogg'].includes(ext || '')) {
//     return '🎵';
//   }
//   if (['mp4', 'webm'].includes(ext || '')) {
//     return '🎥';
//   }
//   return '📄';
// };
