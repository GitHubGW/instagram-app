import Button from "../components/Button";
import styled from "styled-components/native";
import AuthLayout from "../components/AuthLayout";
import { handleLogin } from "../apollo";
import { Input } from "../components/shared";
import { useForm, Controller } from "react-hook-form";
import { MutableRefObject, RefObject, useRef } from "react";
import { RootStackParamList } from "../shared/shared.types";
import { LoginMutation, useLoginMutation } from "../generated/graphql";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type LoginNavigationProps = NativeStackScreenProps<RootStackParamList, "StackLogin">;

interface LoginFormData {
  username: string;
  password: string;
}

const Contaienr = styled.View`
  width: 100%;
  padding: 0 20px;
`;

const Login = ({ route }: LoginNavigationProps) => {
  const passwordRef: MutableRefObject<null> = useRef(null);
  const { control, handleSubmit, getValues, watch } = useForm<LoginFormData>({
    defaultValues: { username: route.params?.username, password: route.params?.password },
  });
  const [loginMutation, { loading: loginLoading }] = useLoginMutation({
    onCompleted: (data: LoginMutation) => {
      const {
        login: { ok, token },
      } = data;

      if (ok === true && token) {
        return handleLogin(token);
      }
      return;
    },
  });

  const onFocusNext = (nextRef: RefObject<HTMLInputElement>): void => {
    nextRef.current?.focus();
  };

  const onValid = (): void => {
    if (loginLoading === true) {
      return;
    }
    const { username, password } = getValues();
    loginMutation({ variables: { username, password } });
  };

  return (
    <AuthLayout>
      <Contaienr>
        <Controller
          name="username"
          control={control}
          rules={{ required: true, minLength: 1, maxLength: 20 }}
          render={({ field: { onChange, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onSubmitEditing={() => onFocusNext(passwordRef)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              placeholder="유저 이름"
              placeholderTextColor="gray"
              blurOnSubmit={false}
              maxLength={20}
            ></Input>
          )}
        ></Controller>
        <Controller
          name="password"
          control={control}
          rules={{ required: true, minLength: 1, maxLength: 30 }}
          render={({ field: { onChange, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onSubmitEditing={handleSubmit(onValid)}
              ref={passwordRef}
              autoCapitalize="none"
              secureTextEntry={true}
              placeholder="비밀번호"
              placeholderTextColor="gray"
              maxLength={30}
            ></Input>
          )}
        ></Controller>
        <Button
          onPress={handleSubmit(onValid)}
          text="로그인"
          size="14px"
          bgFill={true}
          loading={loginLoading}
          disabled={watch("username") === "" || watch("password") === ""}
        ></Button>
      </Contaienr>
    </AuthLayout>
  );
};

export default Login;
