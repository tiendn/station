import { useNetworks } from "app/InitNetworks"
import { WithFetching } from "components/feedback"
import { Read, TokenIcon } from "components/token"
import { useExchangeRates } from "data/queries/coingecko"
import { useCurrency } from "data/settings/Currency"
import { useNetworkName } from "data/wallet"
import { useTranslation } from "react-i18next"
import styles from "./AssetChain.module.scss"

export interface Props {
  chain: string
  balance: string
  symbol: string
  decimals: number
  token: string
}

const AssetChain = (props: Props) => {
  const { chain, symbol, balance, decimals, token } = props
  const currency = useCurrency()
  const { data: prices, ...pricesState } = useExchangeRates()
  const { t } = useTranslation()

  const networkName = useNetworkName()
  const { networks } = useNetworks()

  const { icon, name } = networks[networkName][chain]
  return (
    <article className={styles.chain} key={name}>
      <TokenIcon token={name} icon={icon} size={50} />
      <section className={styles.details}>
        <h1 className={styles.name}>{name}</h1>
        <h1 className={styles.price}>
          {currency.symbol}{" "}
          <Read
            {...props}
            amount={(prices?.[token]?.price || 0) * parseInt(balance)}
            decimals={decimals}
            fixed={2}
            denom=""
            token=""
          />
        </h1>
        <h2 className={styles.amount}>
          <WithFetching {...pricesState} height={1}>
            {(progress, wrong) => (
              <>
                {progress}
                {wrong ? (
                  <span className="danger">{t("Failed to query balance")}</span>
                ) : (
                  <Read {...props} amount={balance} token="" />
                )}
              </>
            )}
          </WithFetching>{" "}
          {symbol}
        </h2>
      </section>
    </article>
  )
}

export default AssetChain
