import { Text } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  background-color: ${(props) => props.theme.bgColor};
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Notification = () => {
  return (
    <Container>
      <Text style={{ color: "white" }}>Notification</Text>
    </Container>
  );
};

export default Notification;
