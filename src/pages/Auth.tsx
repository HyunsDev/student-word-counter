import { FormEventHandler, ReactElement, useReducer } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { FirebaseError } from "firebase/app";
import { auth } from "../firebase";

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
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input
          name="email"
          type="email"
          value={state.email}
          onChange={(e) =>
            dispatch({ type: "change-email", email: e.target.value })
          }
        />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          value={state.password}
          onChange={(e) =>
            dispatch({ type: "change-password", password: e.target.value })
          }
        />
      </label>
      {state.type === "register" && (
        <label>
          Confirm Password
          <input
            name="confirm-password"
            type="password"
            value={state.passwordConfirm}
            onChange={(e) =>
              dispatch({
                type: "change-password-confirm",
                passwordConfirm: e.target.value,
              })
            }
          />
        </label>
      )}
      <input
        type="submit"
        value={state.type === "login" ? "로그인" : "회원가입"}
      />
      {state.type === "login" ? (
        <>
          <p>회원이 아니신가요?</p>
          <button onClick={() => dispatch({ type: "open-register" })}>
            회원가입
          </button>
        </>
      ) : (
        <>
          <p>이미 회원이신가요?</p>
          <button onClick={() => dispatch({ type: "open-login" })}>
            로그인
          </button>
        </>
      )}
      {state.error && <p>{state.error}</p>}
    </form>
  );
}
