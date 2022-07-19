import { AuthProvider, useAuth } from "./context/AuthContext";

import Auth from "./pages/Auth";
import Home from "./pages/Home";

function Inner() {
  const { user } = useAuth();

  if (user) {
    return <Home user={user} />;
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
