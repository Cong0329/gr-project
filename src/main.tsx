import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from './redux/store.ts';
import './index.css'

import '@fortawesome/fontawesome-free/css/all.min.css';
import { ThemeProvider } from './components/admin/context/ThemeContext.tsx';
import { AppWrapper } from './components/admin/components/common/PageMeta.tsx';



createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider>
        <AppWrapper>
          <App />
        </AppWrapper>
      </ThemeProvider>
    </PersistGate>
  </Provider>,
)
