import { render } from '@testing-library/react';
import { test, vi } from 'vitest';

import App from './App';

// Mock TonConnect to prevent initialization issues in tests
vi.mock('@tonconnect/ui-react', () => ({
  TonConnectUIProvider: ({ children }: { children: React.ReactNode }) => children,
  TonConnectButton: () => <div data-testid="ton-connect-button">Connect Wallet</div>,
  useTonAddress: () => '',
  useTonWallet: () => null,
}));

test('App', () => {
  render(<App />);
})