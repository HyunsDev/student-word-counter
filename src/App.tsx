import { AuthProvider, useAuth } from "./context/AuthContext";

import Auth from "./pages/Auth";
import Editor from "./pages/Editor";

function Inner() {
  const { user } = useAuth();

  if (user) {
    return <Editor />;
  }
  return <Auth />;
}

export default function App() {
  return (
    <AuthProvider>
      <Inner />
    </AuthProvider>
  );
}
