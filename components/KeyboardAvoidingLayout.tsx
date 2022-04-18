import { Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import styled from "styled-components/native";

interface KeyboardAvoidingLayoutProps {
  children: React.ReactNode;
}

const TouchableWithoutFeedbackContainer = styled.TouchableWithoutFeedback`
  flex: 1;
  background-color: ${(props) => props.theme.bgColor};
`;

const KeyboardAvoidingViewContainer = styled(KeyboardAvoidingView)`
  flex: 1;
`;

const KeyboardAvoidingLayout = ({ children }: KeyboardAvoidingLayoutProps) => {
  const handleHideKeyboard = (): void => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedbackContainer onPress={handleHideKeyboard} disabled={Platform.OS === "web"}>
      <KeyboardAvoidingViewContainer behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 90 : -50}>
        {children}
      </KeyboardAvoidingViewContainer>
    </TouchableWithoutFeedbackContainer>
  );
};

export default KeyboardAvoidingLayout;
