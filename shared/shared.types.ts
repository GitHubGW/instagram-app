import { User } from "../generated/graphql";

export type RootStackParamList = {
  StackTabNavigation: undefined;
  StackPhotoNavigation: undefined;
  StackUploadPhotoNavigation: any;
  StackRoomsNavigation: any;
  StackProfileNavigation: any;
  StackEnter: undefined;
  StackLogin: { username: string; password: string } | undefined;
  StackSignUp: undefined;
  StackFeed: any;
  StackPhoto: { photoId: number };
  StackNotification: any;
  StackProfile: any;
  StackLikes: { photoId: number };
  StackComments: { photoId: number; caption: string; createdAt: number; user: User };
  StackRooms: any;
  StackRoom: any;
  StackFollowers: any;
  StackFollowing: any;
  [key: string]: any;
};
