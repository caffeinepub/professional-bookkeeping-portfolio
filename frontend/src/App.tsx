import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { InternetIdentityProvider } from './hooks/useInternetIdentity';
import { Portfolio } from './pages/Portfolio';

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <InternetIdentityProvider>
        <QueryClientProvider client={queryClient}>
          <Portfolio />
        </QueryClientProvider>
      </InternetIdentityProvider>
    </ThemeProvider>
  );
}

export default App;
