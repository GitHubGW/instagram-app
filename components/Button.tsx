import styled from "styled-components/native";

interface ButtonProps {
  onPress: () => void;
  text: string;
  size: string;
  bgFill: boolean;
}

const ButtonContainer = styled.TouchableOpacity<{ disabled: boolean; bgFill: boolean }>`
  padding: 15px 0px;
  border-radius: 3px;
  margin-bottom: 8px;
  opacity: ${(props) => (props.disabled === true ? "0.2" : "1")};
  background-color: ${(props) => (props.bgFill === true ? props.theme.activeColor : "transparent")};
`;

const ButtonText = styled.Text<{ size: string; bgFill: boolean }>`
  text-align: center;
  font-size: ${(props) => props.size};
  color: ${(props) => (props.bgFill === true ? "white" : props.theme.activeColor)};
`;

const Button = ({ onPress, text, size, bgFill }: ButtonProps) => {
  return (
    <ButtonContainer onPress={onPress} disabled={false} bgFill={bgFill}>
      <ButtonText size={size} bgFill={bgFill}>
        {text}
      </ButtonText>
    </ButtonContainer>
  );
};

export default Button;
