import { ChangeEventHandler, FormEventHandler, ReactElement } from "react";

import styled from "styled-components";

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  gap: 1rem;
`;

const GitHubLink = styled.a`
  align-self: center;
  color: black;
  font-weight: bold;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0.75rem;
  gap: 0.5rem;
`;

const InputIcon = styled.span``;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border: 1px solid #cacaca;
  border-radius: 0.25rem;

  & ${InputContainer} {
    border-bottom: 1px solid #cacaca;

    &:last-child {
      border-bottom: none;
    }
  }
`;

const StyledInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
`;

const StyledSubmit = styled.input`
  padding: 0.25rem 0.5rem;
  background: black;
  color: white;
  border-radius: 0.25rem;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  cursor: pointer;
`;

const QuestionContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  justify-content: center;
`;

const Question = styled.span`
  color: #929292;
`;

const LinkButton = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.span`
  color: #eb3939;
  text-align: center;
`;

export type AuthState =
  | {
      type: "login";
      email: string;
      password: string;
      error?: string;
    }
  | {
      type: "register";
      email: string;
      password: string;
      passwordConfirm: string;
      error?: string;
    };

type AuthFormProps = AuthState & {
  onSubmit: FormEventHandler;
  onEmailChange: ChangeEventHandler<HTMLInputElement>;
  onPasswordChange: ChangeEventHandler<HTMLInputElement>;
  onPasswordConfirmChange: ChangeEventHandler<HTMLInputElement>;
  onScreenChange: (type: "login" | "register") => void;
};

export default function AuthForm(props: AuthFormProps): ReactElement {
  return (
    <FormContainer onSubmit={props.onSubmit}>
      <GitHubLink
        href="https://github.com/HyunsDev/student-word-counter"
        target={"_blank"}
      >
        🧑‍🎓 학생부 / 자소서 글자수 계산기
      </GitHubLink>
      <InputGroup>
        <InputContainer>
          <InputIcon>✉️</InputIcon>
          <StyledInput
            name="email"
            type="email"
            placeholder="이메일"
            value={props.email}
            onChange={props.onEmailChange}
          />
        </InputContainer>
        <InputContainer>
          <InputIcon>🔒</InputIcon>
          <StyledInput
            name="password"
            type="password"
            placeholder="비밀번호"
            value={props.password}
            onChange={props.onPasswordChange}
          />
        </InputContainer>
        {props.type === "register" && (
          <InputContainer>
            <InputIcon>🔒</InputIcon>
            <StyledInput
              name="confirm-password"
              type="password"
              placeholder="비밀번호 확인"
              value={props.passwordConfirm}
              onChange={props.onPasswordConfirmChange}
            />
          </InputContainer>
        )}
      </InputGroup>
      <StyledSubmit
        type="submit"
        value={props.type === "login" ? "로그인" : "회원가입"}
      />
      <QuestionContainer>
        {props.type === "login" ? (
          <>
            <Question>회원이 아니신가요?</Question>
            <LinkButton
              type="button"
              onClick={() => props.onScreenChange("register")}
            >
              회원가입
            </LinkButton>
          </>
        ) : (
          <>
            <Question>이미 회원이신가요?</Question>
            <LinkButton
              type="button"
              onClick={() => props.onScreenChange("login")}
            >
              로그인
            </LinkButton>
          </>
        )}
      </QuestionContainer>
      {props.error && <ErrorMessage>{props.error}</ErrorMessage>}
    </FormContainer>
  );
}
