import { PropsWithChildren } from "react"
import { useTranslation } from "react-i18next"
import createContext from "utils/createContext"
import { GasPrices, useGasPrices } from "data/Terra/TerraAPI"
import { Card } from "components/layout"
import { ErrorBoundary, Wrong } from "components/feedback"
import { useTxKey } from "./Tx"
import TaxParamsContext from "./wasm/TaxParams"

export const [useTx, TxProvider] = createContext<{ gasPrices: GasPrices }>(
  "useTx"
)

const TxContext = ({ children }: PropsWithChildren<{}>) => {
  const { t } = useTranslation()
  const txKey = useTxKey()
  const { data: gasPrices } = useGasPrices()

  /* on error */
  const fallback = () => (
    <Card>
      <Wrong>{t("Transaction is not available at the moment")}</Wrong>
    </Card>
  )

  // If the gas prices doesn't exist, nothing is worth rendering.
  if (!gasPrices) return null

  return (
		<TaxParamsContext>
			<TxProvider value={{ gasPrices: gasPrices as GasPrices }} key={txKey}>
				<ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>
			</TxProvider>
		</TaxParamsContext>
  );
}

export default TxContext
