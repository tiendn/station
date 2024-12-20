type Bip = 118 | 330

type Wallet =
  | SingleWallet
  | PreconfiguredWallet
  | MultisigWallet
  | LedgerWallet
  | RNWallet
type LocalWallet = SingleWallet | MultisigWallet // wallet with name

interface SingleWallet {
  address: string
  name: string
  lock?: boolean
}

interface PreconfiguredWallet extends SingleWallet {
  mnemonic: string
}

interface MultisigWallet extends SingleWallet {
  multisig: true
}

interface LedgerWallet extends SingleWallet {
  name?: string
  ledger: true
  index: number
  bluetooth: boolean
}

interface StoredWallet extends SingleWallet {
  encrypted: string
}

interface StoredWalletLegacy extends SingleWallet {
  wallet: string
}

interface RNWallet extends SingleWallet {
  password: string
  encryptedKey: string
  ledger?: boolean
  path?: number
}
