import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from "react-native";
import styled from "styled-components/native";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const TouchableWithoutFeedbackContainer = styled(TouchableWithoutFeedback)`
  flex: 1;
  background-color: black;
`;

const KeyboardAvoidingViewContainer = styled(KeyboardAvoidingView)`
  width: 100%;
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
    <TouchableWithoutFeedbackContainer onPress={handleHideKeyboard} disabled={Platform.OS === "web"}>
      <Container>
        <LogoContainer>
          <LogoImage source={require("../assets/instagram_logo.png")} resizeMode="contain"></LogoImage>
        </LogoContainer>
        <KeyboardAvoidingViewContainer behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 50 : -50}>
          {children}
        </KeyboardAvoidingViewContainer>
      </Container>
    </TouchableWithoutFeedbackContainer>
  );
};

export default AuthLayout;
