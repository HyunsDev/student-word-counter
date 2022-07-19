import AuthForm, { AuthState } from "./AuthForm";
import { FormEventHandler, ReactElement, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { FirebaseError } from "firebase/app";
import { auth } from "../../firebase";
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
  const [state, setState] = useState<AuthState>({
    type: "login",
    email: "",
    password: "",
  });

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setState((original) => ({
        ...original,
        error:
          error instanceof FirebaseError
            ? translateFirebaseErrorCode(error.code)
            : "알 수 없는 오류입니다.",
      }));
    }
  };
  const register = async (
    email: string,
    password: string,
    passwordConfirm: string
  ) => {
    if (password !== passwordConfirm) {
      setState((original) => ({
        ...original,
        error: "비밀번호가 일치하지 않습니다.",
      }));
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setState((original) => ({
        ...original,
        error:
          error instanceof FirebaseError
            ? translateFirebaseErrorCode(error.code)
            : "알 수 없는 오류입니다.",
      }));
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
      <AuthForm
        {...state}
        onSubmit={handleSubmit}
        onEmailChange={(e) =>
          setState((original) => ({ ...original, email: e.target.value }))
        }
        onPasswordChange={(e) =>
          setState((original) => ({ ...original, password: e.target.value }))
        }
        onPasswordConfirmChange={(e) =>
          setState((original) =>
            original.type === "register"
              ? { ...original, passwordConfirm: e.target.value }
              : original
          )
        }
        onScreenChange={(type) =>
          setState(
            type === "login"
              ? { type, email: "", password: "" }
              : { type, email: "", password: "", passwordConfirm: "" }
          )
        }
      />
    </FullPage>
  );
}
