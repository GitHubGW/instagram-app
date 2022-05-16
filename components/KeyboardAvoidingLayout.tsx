import styled from "styled-components/native";
import { Keyboard, KeyboardAvoidingView, Platform } from "react-native";

interface KeyboardAvoidingLayoutProps {
  children: React.ReactNode;
}

const KeyboardAvoidingViewContainer = styled(KeyboardAvoidingView)`
  flex: 1;
`;

const TouchableWithoutFeedbackContainer = styled.TouchableWithoutFeedback`
  /* flex: 1; */
  border: 3px solid green;
  background-color: ${(props) => props.theme.bgColor};
`;

const KeyboardAvoidingLayout = ({ children }: KeyboardAvoidingLayoutProps) => {
  const handleHideKeyboard = (): void => {
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingViewContainer behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 90 : -50}>
      {children}
    </KeyboardAvoidingViewContainer>
  );
};

export default KeyboardAvoidingLayout;
