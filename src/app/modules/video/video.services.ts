import unlinkFile, { extractPathFromUrl } from '../../../shared/unlinkFile';
import { IVideo } from './video.interface';
import { Video } from './video.model';

const createVideo = async (payload: IVideo) => {
  const result = await Video.create(payload);
  return result;
};
const getVideos = async () => {
  const result = await Video.find();
  return result[0];
};
const updateVideo = async (id: string, payload: Partial<IVideo>) => {
  const existingVideo = await Video.findById(id);

  if (existingVideo?.url && payload.url) {
    unlinkFile(extractPathFromUrl(existingVideo?.url));
  }
  if (existingVideo?.thumbnail && payload.thumbnail) {
    unlinkFile(extractPathFromUrl(existingVideo?.thumbnail));
  }
  const result = await Video.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};
const deleteVideo = async (id: string) => {
  const existingVideo = await Video.findById(id);

  if (existingVideo?.url) {
    unlinkFile(extractPathFromUrl(existingVideo?.url));
  }
  if (existingVideo?.thumbnail) {
    unlinkFile(extractPathFromUrl(existingVideo?.thumbnail));
  }
  const result = await Video.findByIdAndDelete(id);
  return result;
};

export const VideoService = {
  createVideo,
  getVideos,
  updateVideo,
  deleteVideo,
};
