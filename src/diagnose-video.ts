import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';

const MONGO_URI = 'mongodb://rodneyUser:StrongPassword123@127.0.0.1:27017/rodneyDB?authSource=rodneyDB';

async function diagnose() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB');

    const Video = mongoose.model('Video', new mongoose.Schema({ url: String }));
    const videoId = '67b660c5ea1f9eb95561a3ec';
    const video = await Video.findById(videoId) as any;

    if (!video) {
      console.log('Video NOT found in DB');
      return;
    }

    console.log('Video URL in DB:', video.url);

    try {
      const url = new URL(video.url);
      const urlPath = url.pathname;
      const videoPath = path.join(process.cwd(), urlPath);

      console.log('Parsed urlPath:', urlPath);
      console.log('Constructed videoPath:', videoPath);
      console.log('File exists:', fs.existsSync(videoPath));

      if (!fs.existsSync(videoPath)) {
          // Check if uploads folder exists
          const uploadsDir = path.join(process.cwd(), 'uploads');
          console.log('Uploads dir exists:', fs.existsSync(uploadsDir));
          if (fs.existsSync(uploadsDir)) {
              console.log('Contents of uploads/media:', fs.readdirSync(path.join(uploadsDir, 'media')));
          }
      }
    } catch (e) {
      console.error('Error parsing URL:', video.url, e);
    }

  } catch (err) {
    console.error('Diagnosis failed:', err);
  } finally {
    await mongoose.connection.close();
  }
}

diagnose();
