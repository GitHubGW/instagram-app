export type RootStackParamList = {
  StackEnter: undefined;
  StackLogin: { username: string; password: string } | undefined;
  StackSignUp: undefined;
  StackPhoto: undefined;
  StackProfile: undefined;
  StackLikes: undefined;
  StackComments: undefined;
  [key: string]: any;
};
