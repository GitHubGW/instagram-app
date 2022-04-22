import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import KeyboardAvoidingLayout from "../components/KeyboardAvoidingLayout";
import Loading from "../components/Loading";
import MessageItem from "../components/MessageItem";
import { useSeeRoomQuery, useSendMessageMutation } from "../generated/graphql";
import { RootStackParamList } from "../shared/shared.types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ApolloCache, Reference } from "@apollo/client";
import gql from "graphql-tag";
import useLoggedInUser from "../hooks/useLoggedInUser";

type RoomNavigationProps = NativeStackScreenProps<RootStackParamList, "StackRoom">;

interface MessageFormData {
  text: string;
}

const Container = styled.View`
  background-color: ${(props) => props.theme.bgColor};
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const FlatListContainer = styled(FlatList)`
  width: 100%;
  flex: 1;
  margin-bottom: 10px;
`;

const InputContainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  position: relative;
`;

const MessageTextInput = styled.TextInput`
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
  padding: 10px 15px;
  border-radius: 50px;
  border: 1px solid lightgray;
  width: 95%;
`;

const SendButton = styled.TouchableOpacity`
  position: absolute;
  right: 20px;
`;

const UserContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Avatar = styled.Image`
  width: 25px;
  height: 25px;
  margin-right: 7px;
  border-radius: 50px;
`;

const Username = styled.Text`
  font-weight: bold;
`;

const Room = ({ navigation, route }: RoomNavigationProps) => {
  const loggedInUser = useLoggedInUser();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { control, handleSubmit, getValues, setValue, watch } = useForm<MessageFormData>({ defaultValues: { text: "" } });
  const { data: seeRoomData, loading: seeRoomLoading, refetch } = useSeeRoomQuery({ variables: { roomId: route.params?.id } });
  const [sendMessageMutation, { loading: sendMessageLoading }] = useSendMessageMutation({
    update: (cache: ApolloCache<any>, { data }) => {
      if (data?.sendMessage.ok === false) {
        return;
      }

      const { text } = getValues();
      setValue("text", "");
      const messageReference: Reference | undefined = cache.writeFragment({
        fragment: gql`
          fragment message on Message {
            id
            text
            read
            createdAt
            user
          }
        `,
        data: {
          __typename: "Message",
          id: data?.sendMessage.id,
          text,
          read: true,
          createdAt: String(Date.now()),
          user: { __ref: `User:${loggedInUser?.id}` },
        },
      });
      cache.modify({
        id: `Room:${route.params?.id}`,
        fields: {
          messages: (messages) => [...messages, messageReference],
          latestMessage: (latestMessage) => messageReference,
        },
      });
    },
  });

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderItem = ({ item: message }: any) => {
    return <MessageItem {...message} otherUser={route.params?.otherUser} />;
  };

  const onValid = (): void => {
    if (sendMessageLoading === true) {
      return;
    }
    const { text } = getValues();
    sendMessageMutation({ variables: { roomId: route.params?.id, text } });
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <UserContainer>
          <Avatar source={{ uri: route.params?.otherUser.avatarUrl }} />
          <Username>{route.params?.otherUser.username}</Username>
        </UserContainer>
      ),
    });
  }, []);

  return (
    <KeyboardAvoidingLayout>
      <Container>
        {seeRoomLoading === true ? (
          <Loading />
        ) : (
          <>
            <FlatListContainer
              inverted={true}
              showsVerticalScrollIndicator={false}
              refreshing={refreshing}
              onRefresh={onRefresh}
              data={[...(seeRoomData?.seeRoom.room?.messages || [])].reverse()}
              renderItem={renderItem}
              keyExtractor={(message: any) => String(message.id)}
            ></FlatListContainer>
            <InputContainer>
              <Controller
                name="text"
                control={control}
                rules={{ required: true, minLength: 1, maxLength: 80 }}
                render={({ field: { onChange, value } }) => (
                  <MessageTextInput
                    value={value}
                    onChangeText={onChange}
                    onSubmitEditing={handleSubmit(onValid)}
                    keyboardType="default"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyLabel="Send Message"
                    returnKeyType="send"
                    placeholder="메세지 쓰기.."
                    placeholderTextColor="gray"
                    maxLength={80}
                  />
                )}
              ></Controller>
              <SendButton onPress={handleSubmit(onValid)} disabled={Boolean(watch("text")) === false}>
                {sendMessageLoading === true ? <Loading /> : <Ionicons name="send" color={watch("text") !== "" ? "dodgerblue" : "lightgray"} size={22}></Ionicons>}
              </SendButton>
            </InputContainer>
          </>
        )}
      </Container>
    </KeyboardAvoidingLayout>
  );
};

export default Room;
