import styled from "styled-components/native";
import KeyboardAvoidingLayout from "./KeyboardAvoidingLayout";
import { isDarkModeVar } from "../apollo";
import { useReactiveVar } from "@apollo/client";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.bgColor};
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
  const isDarkMode: "light" | "dark" = useReactiveVar(isDarkModeVar);

  return (
    <KeyboardAvoidingLayout>
      <Container>
        <LogoContainer>
          {isDarkMode === "dark" ? (
            <LogoImage source={require("../assets/instagram_logo_dark.png")} resizeMode="contain"></LogoImage>
          ) : (
            <LogoImage source={require("../assets/instagram_logo_light.png")} resizeMode="contain"></LogoImage>
          )}
        </LogoContainer>
        {children}
      </Container>
    </KeyboardAvoidingLayout>
  );
};

export default AuthLayout;
