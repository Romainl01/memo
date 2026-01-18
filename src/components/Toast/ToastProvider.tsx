import { Toast } from './Toast';

interface ToastProviderProps {
  children: React.ReactNode;
}

function ToastProvider({ children }: ToastProviderProps): React.ReactElement {
  return (
    <>
      {children}
      <Toast />
    </>
  );
}

export { ToastProvider };
export type { ToastProviderProps };
