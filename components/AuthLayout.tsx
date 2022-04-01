import { Keyboard, TouchableWithoutFeedback } from "react-native";
import styled from "styled-components/native";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const Wrapper = styled(TouchableWithoutFeedback)`
  flex: 1;
  background-color: black;
`;

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.bgColor};
  background-color: black;
`;

const LogoContainer = styled.View`
  width: 180px;
  height: 120px;
  margin-bottom: 10px;
`;

const LogoImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const handleHideKeyboard = (): void => {
    Keyboard.dismiss();
  };

  return (
    <Wrapper onPress={handleHideKeyboard}>
      <Container>
        <LogoContainer>
          <LogoImage source={require("../assets/instagram_logo3.png")} resizeMode="contain"></LogoImage>
        </LogoContainer>
        {children}
      </Container>
    </Wrapper>
  );
};

export default AuthLayout;
