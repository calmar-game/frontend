import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWalletSession } from '../hooks/useWalletSession';

export function WalletButtonWithSession(props: JSX.IntrinsicElements['button']) {
  useWalletSession();

  return <WalletMultiButton {...props} />;
}