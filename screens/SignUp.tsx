import Button from "../components/Button";
import styled from "styled-components/native";
import AuthLayout from "../components/AuthLayout";
import { Input } from "../components/shared";
import { useForm, Controller } from "react-hook-form";
import { MutableRefObject, RefObject, useRef } from "react";
import { RootStackParamList } from "../shared/shared.types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CreateAccountMutation, useCreateAccountMutation } from "../generated/graphql";

type SignUpNavigationProps = NativeStackScreenProps<RootStackParamList, "StackSignUp">;

interface SignUpFormData {
  email: string;
  name: string;
  username: string;
  password: string;
}

const Contaienr = styled.View`
  width: 100%;
  padding: 0 20px;
`;

const SignUp = ({ navigation }: SignUpNavigationProps) => {
  const nameRef: MutableRefObject<null> = useRef(null);
  const usernameRef: MutableRefObject<null> = useRef(null);
  const passwordRef: MutableRefObject<null> = useRef(null);
  const { control, handleSubmit, getValues } = useForm<SignUpFormData>({ defaultValues: { email: "", name: "", username: "", password: "" } });
  const [createAccountMutation, { loading: createAccountLoading }] = useCreateAccountMutation({
    onCompleted: (data: CreateAccountMutation) => {
      if (data.createAccount.ok === false) {
        return;
      }
      const { username, password } = getValues();
      console.log("username, password", username, password);

      navigation.navigate("StackLogin", { username, password });
    },
  });

  const onFocusNext = (nextRef: RefObject<HTMLInputElement>): void => {
    nextRef.current?.focus();
  };

  const onValid = (): void => {
    if (createAccountLoading === true) {
      return;
    }
    const { email, name, username, password } = getValues();
    createAccountMutation({ variables: { email, name, username, password } });
  };

  return (
    <AuthLayout>
      <Contaienr>
        <Controller
          name="email"
          control={control}
          rules={{ required: true, minLength: 1, maxLength: 20 }}
          render={({ field: { onChange, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onSubmitEditing={() => onFocusNext(nameRef)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              placeholder="이메일"
              placeholderTextColor="gray"
              blurOnSubmit={false}
              maxLength={20}
            ></Input>
          )}
        ></Controller>
        <Controller
          name="name"
          control={control}
          rules={{ required: true, minLength: 1, maxLength: 20 }}
          render={({ field: { onChange, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onSubmitEditing={() => onFocusNext(usernameRef)}
              ref={nameRef}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              placeholder="이름"
              placeholderTextColor="gray"
              blurOnSubmit={false}
              maxLength={20}
            ></Input>
          )}
        ></Controller>
        <Controller
          name="username"
          control={control}
          rules={{ required: true, minLength: 1, maxLength: 20 }}
          render={({ field: { onChange, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onSubmitEditing={() => onFocusNext(passwordRef)}
              ref={usernameRef}
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
        <Button onPress={handleSubmit(onValid)} text="회원가입" size="14px" bgFill={true} loading={false} disabled={false}></Button>
      </Contaienr>
    </AuthLayout>
  );
};

export default SignUp;
