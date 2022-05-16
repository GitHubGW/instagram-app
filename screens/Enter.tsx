import Button from "../components/Button";
import styled from "styled-components/native";
import AuthLayout from "../components/AuthLayout";
import { RootStackParamList } from "../shared/shared.types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type EnterNavigationProps = NativeStackScreenProps<RootStackParamList, "StackEnter">;

const Container = styled.View`
  width: 100%;
`;

const ButtonsContainer = styled.View`
  padding: 0 20px;
`;

const Enter = ({ navigation }: EnterNavigationProps) => {
  const onPressLogin = (): void => {
    navigation.navigate("StackLogin");
  };

  const onPressSignUp = (): void => {
    return navigation.navigate("StackSignUp");
  };

  return (
    <AuthLayout>
      <Container>
        <ButtonsContainer>
          <Button onPress={onPressLogin} text="로그인" size="14px" bgFill={true} loading={false} disabled={false}></Button>
          <Button onPress={onPressSignUp} text="회원가입" size="14px" bgFill={false} loading={false} disabled={false}></Button>
        </ButtonsContainer>
      </Container>
    </AuthLayout>
  );
};

export default Enter;
