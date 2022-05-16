import Loading from "../components/Loading";
import styled from "styled-components/native";
import RoomItem from "../components/RoomItem";
import useLoggedInUser from "../hooks/useLoggedInUser";
import { useState } from "react";
import { useSeeRoomsQuery } from "../generated/graphql";

const Container = styled.View`
  background-color: ${(props) => props.theme.bgColor};
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const FlatListContainer = styled.FlatList`
  width: 100%;
`;

const Rooms = () => {
  const loggedInUser = useLoggedInUser();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { data: seeRoomsData, loading: seeRoomsLoading, refetch } = useSeeRoomsQuery();

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderItem = ({ item: room }: any) => {
    const otherUser = room.users.find((user: any) => user.username !== loggedInUser?.username);
    return <RoomItem {...room} otherUser={otherUser} latestMessage={room.latestMessage} />;
  };

  return (
    <Container>
      {seeRoomsLoading === true ? (
        <Loading />
      ) : (
        <FlatListContainer
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
          data={seeRoomsData?.seeRooms.rooms}
          renderItem={renderItem}
          keyExtractor={(room: any) => String(room.id)}
        ></FlatListContainer>
      )}
    </Container>
  );
};

export default Rooms;
