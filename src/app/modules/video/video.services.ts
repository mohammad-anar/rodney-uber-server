import { IVideo } from './video.interface';

const createVideo = async (payload: IVideo) => {};
const getVideos = async () => {};
const updateVideo = async (id: string, payload: Partial<IVideo>) => {};
const deleteVideo = async (id: string) => {};

export const VideoService = {
  createVideo,
  getVideos,
  updateVideo,
  deleteVideo,
};
