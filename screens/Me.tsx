import Button from "../components/Button";
import styled from "styled-components/native";
import useLoggedInUser from "../hooks/useLoggedInUser";
import { useEffect } from "react";
import { Text } from "react-native";
import { handleLogout } from "../apollo";
import { RootStackParamList } from "../shared/shared.types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type MeNavigationProps = NativeStackScreenProps<RootStackParamList, "StackProfile">;

const Container = styled.View`
  background-color: ${(props) => props.theme.bgColor};
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Me = ({ navigation }: MeNavigationProps) => {
  const loggedInUser = useLoggedInUser();

  useEffect(() => {
    if (loggedInUser && loggedInUser.name && loggedInUser.username) {
      navigation.setOptions({ headerTitle: `${loggedInUser?.name}(@${loggedInUser?.username})` });
    }
  }, []);

  return (
    <Container>
      <Text style={{ color: "white" }}>Me</Text>
      <Button onPress={handleLogout} text="로그아웃" size="14px" bgFill={true} loading={false} disabled={false}></Button>
    </Container>
  );
};

export default Me;
