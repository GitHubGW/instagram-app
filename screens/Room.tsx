import gql from "graphql-tag";
import Loading from "../components/Loading";
import styled from "styled-components/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MessageItem from "../components/MessageItem";
import KeyboardAvoidingLayout from "../components/KeyboardAvoidingLayout";
import { FlatList } from "react-native";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { RootStackParamList } from "../shared/shared.types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ApolloCache, ApolloClient, Reference, useApolloClient } from "@apollo/client";
import { MESSAGE_UPDATES_SUBSCRIPTION } from "../documents/subscriptions/messageUpdates.subscription";
import { SeeRoomQuery, useMessageUpdatesSubscription, useSeeRoomQuery, useSendMessageMutation } from "../generated/graphql";

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
  const client: ApolloClient<object> = useApolloClient();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { control, handleSubmit, getValues, setValue, watch } = useForm<MessageFormData>({ defaultValues: { text: "" } });
  const { data: messageUpdatesData } = useMessageUpdatesSubscription({ variables: { roomId: route.params?.id } });
  const { data: seeRoomData, loading: seeRoomLoading, refetch, subscribeToMore } = useSeeRoomQuery({ variables: { roomId: route.params?.id } });
  const [sendMessageMutation, { loading: sendMessageLoading }] = useSendMessageMutation({
    update: (cache, { data }) => {
      if (data?.sendMessage.ok === false) {
        return;
      }
      setValue("text", "");
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
    if (seeRoomData?.seeRoom.ok === true) {
      subscribeToMore({
        document: MESSAGE_UPDATES_SUBSCRIPTION,
        variables: { roomId: route.params?.id },
        updateQuery: (prev: SeeRoomQuery, { subscriptionData }: any): any => {
          if (subscriptionData.data.messageUpdates.id) {
            const existingMessage = prev.seeRoom.room?.messages?.find((message) => message?.id === subscriptionData.data.messageUpdates.id);
            if (existingMessage) {
              return;
            }

            const messageReference: Reference | undefined = client.cache.writeFragment({
              fragment: gql`
                fragment message on Message {
                  id
                  text
                  read
                  createdAt
                  user
                }
              `,
              data: subscriptionData.data.messageUpdates,
            });
            client.cache.modify({
              id: `Room:${route.params?.id}`,
              fields: {
                messages: (prev) => {
                  const existingMessageReference = prev.find((prevMessages: any) => prevMessages.__ref === messageReference?.__ref);
                  if (existingMessageReference) {
                    return;
                  }
                  return [...prev, { __ref: `Message:${subscriptionData.data.messageUpdates.id}` }];
                },
                latestMessage: (latestMessage) => messageReference,
              },
            });
          }
        },
      });
    }
  }, [seeRoomData]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <UserContainer>
          {route.params?.otherUser.avatarUrl ? <Avatar source={{ uri: route.params?.otherUser.avatarUrl }} /> : <Avatar source={require("../assets/basic_user.jpeg")} />}
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
