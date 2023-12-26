import * as path from 'path';

const extensions = ['.jpg', '.png', '.jpeg', '.webp'];

export const filesFilter = (req, file, callback) => {
  const ext = path.extname(file.originalname);

  if (!extensions.includes(ext)) {
    req.fileValidationError = 'Invalid file type';
    return callback(new Error('Invalid file type'), false);
  }
  return callback(null, true);
};
