import { FormEventHandler, ReactElement, useReducer } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { FirebaseError } from "firebase/app";
import { auth } from "../firebase";
import styled from "styled-components";

const FullPage = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 1rem 5rem 1rem;
`;

const AuthForm = styled.form`
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

type AuthState =
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

type AuthAction =
  | {
      type: "open-login";
    }
  | {
      type: "open-register";
    }
  | {
      type: "change-email";
      email: string;
    }
  | {
      type: "change-password";
      password: string;
    }
  | {
      type: "change-password-confirm";
      passwordConfirm: string;
    }
  | {
      type: "set-error";
      error?: string;
    };

function authStateReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "open-login":
      return {
        type: "login",
        email: "",
        password: "",
      };
    case "open-register":
      return {
        type: "register",
        email: "",
        password: "",
        passwordConfirm: "",
      };
    case "change-email":
      return {
        ...state,
        email: action.email,
      };
    case "change-password":
      return {
        ...state,
        password: action.password,
      };
    case "change-password-confirm": {
      if (state.type === "login") return state;
      return {
        ...state,
        passwordConfirm: action.passwordConfirm,
      };
    }
    case "set-error":
      return {
        ...state,
        error: action.error,
      };
  }
}

function translateFirebaseErrorCode(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "이미 사용중인 이메일입니다.";
    case "auth/invalid-email":
      return "유효하지 않은 이메일입니다.";
    case "auth/weak-password":
      return "비밀번호가 약합니다.";
    case "auth/wrong-password":
      return "비밀번호가 일치하지 않습니다.";
    default:
      return "알 수 없는 오류입니다.";
  }
}

export default function Auth(): ReactElement {
  const [state, dispatch] = useReducer(authStateReducer, {
    type: "login",
    email: "",
    password: "",
  });

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      dispatch({
        type: "set-error",
        error:
          error instanceof FirebaseError
            ? translateFirebaseErrorCode(error.code)
            : "알 수 없는 오류가 발생했습니다.",
      });
    }
  };
  const register = async (
    email: string,
    password: string,
    passwordConfirm: string
  ) => {
    if (password !== passwordConfirm) {
      dispatch({ type: "set-error", error: "비밀번호를 확인해주세요." });
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      dispatch({
        type: "set-error",
        error:
          error instanceof FirebaseError
            ? translateFirebaseErrorCode(error.code)
            : "알 수 없는 오류가 발생했습니다.",
      });
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (state.type === "login") login(state.email, state.password);
    if (state.type === "register")
      register(state.email, state.password, state.passwordConfirm);
  };

  return (
    <FullPage>
      <AuthForm onSubmit={handleSubmit}>
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
              value={state.email}
              onChange={(e) =>
                dispatch({ type: "change-email", email: e.target.value })
              }
            />
          </InputContainer>
          <InputContainer>
            <InputIcon>🔒</InputIcon>
            <StyledInput
              name="password"
              type="password"
              placeholder="비밀번호"
              value={state.password}
              onChange={(e) =>
                dispatch({ type: "change-password", password: e.target.value })
              }
            />
          </InputContainer>
          {state.type === "register" && (
            <InputContainer>
              <InputIcon>🔒</InputIcon>
              <StyledInput
                name="confirm-password"
                type="password"
                placeholder="비밀번호 확인"
                value={state.passwordConfirm}
                onChange={(e) =>
                  dispatch({
                    type: "change-password-confirm",
                    passwordConfirm: e.target.value,
                  })
                }
              />
            </InputContainer>
          )}
        </InputGroup>
        <StyledSubmit
          type="submit"
          value={state.type === "login" ? "로그인" : "회원가입"}
        />
        <QuestionContainer>
          {state.type === "login" ? (
            <>
              <Question>회원이 아니신가요?</Question>
              <LinkButton onClick={() => dispatch({ type: "open-register" })}>
                회원가입
              </LinkButton>
            </>
          ) : (
            <>
              <Question>이미 회원이신가요?</Question>
              <LinkButton onClick={() => dispatch({ type: "open-login" })}>
                로그인
              </LinkButton>
            </>
          )}
        </QuestionContainer>
        {state.error && <ErrorMessage>{state.error}</ErrorMessage>}
      </AuthForm>
    </FullPage>
  );
}
