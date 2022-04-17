import { User } from "../generated/graphql";

export type RootStackParamList = {
  StackEnter: undefined;
  StackLogin: { username: string; password: string } | undefined;
  StackSignUp: undefined;
  StackPhoto: { photoId: number };
  StackProfile: any;
  StackLikes: { photoId: number };
  StackComments: { photoId: number; caption: string; createdAt: number; user: User };
  StackTabNavigation: undefined;
  StackPhotoNavigation: undefined;
  StackUploadPhotoNavigation: any;
  [key: string]: any;
};
