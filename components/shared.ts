import styled from "styled-components/native";

export const Input = styled.TextInput`
  background-color: ${(props) => props.theme.inputBgColor};
  color: ${(props) => props.theme.textColor};
  margin-bottom: 10px;
  padding: 12px 0;
  padding-left: 7px;
  border-radius: 3px;
`;
