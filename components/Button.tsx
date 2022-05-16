import Loading from "./Loading";
import styled from "styled-components/native";

interface ButtonProps {
  onPress: () => void;
  text: string;
  size: string;
  bgFill: boolean;
  loading: boolean;
  disabled: boolean;
}

const ButtonContainer = styled.TouchableOpacity<{ disabled: boolean; bgFill: boolean }>`
  padding: 15px 0px;
  border-radius: 3px;
  margin-bottom: 8px;
  opacity: ${(props) => (props.disabled === true ? 0.5 : 1)};
  background-color: ${(props) => (props.bgFill === true ? props.theme.activeColor : "transparent")};
`;

const ButtonText = styled.Text<{ size: string; bgFill: boolean }>`
  text-align: center;
  font-size: ${(props) => props.size};
  color: ${(props) => (props.bgFill === true ? "white" : props.theme.activeColor)};
`;

const Button = ({ onPress, text, size, bgFill, loading, disabled }: ButtonProps) => {
  return (
    <ButtonContainer onPress={onPress} disabled={disabled} bgFill={bgFill}>
      {loading === true ? (
        <Loading />
      ) : (
        <ButtonText size={size} bgFill={bgFill}>
          {text}
        </ButtonText>
      )}
    </ButtonContainer>
  );
};

export default Button;
