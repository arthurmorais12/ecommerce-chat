import { ChatLayout } from "./components/chat/ChatLayout";
import { ThemeProvider } from "./components/theme-provider";

function App() {
  return (
    // Envolvemos o App com o ThemeProvider
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main>
        <ChatLayout />
      </main>
    </ThemeProvider>
  );
}

export default App;
