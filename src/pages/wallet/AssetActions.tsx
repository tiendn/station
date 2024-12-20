import { useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { flatten, uniq } from "ramda"
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined"
import ShortcutOutlinedIcon from "@mui/icons-material/ShortcutOutlined"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import { isDenomTerraNative } from "terra-classic-utils";
import { has } from "utils/num"
import { useIsClassic } from "data/query"
import { useNetworkName } from "data/wallet"
import { useIsWalletEmpty } from "data/queries/bank"
import { useCW20Pairs } from "data/Terra/TerraAssets"
import { useTFMTokens } from "data/external/tfm"
import {
  InternalButton,
  InternalLink,
  ExternalIconLink,
} from "components/general"
import { ExtraActions } from "components/layout"
import { ModalButton } from "components/feedback"
import { ListGroup } from "components/display"
import { useBuyList } from "./Buy"
import { Props } from "./Asset"
import is from "auth/scripts/is"

const AssetActions = ({ token, symbol, balance }: Props) => {
  const { t } = useTranslation()
  const { state } = useLocation()

  const isWalletEmpty = useIsWalletEmpty()
  const isClassic = useIsClassic()
  const networkName = useNetworkName()
  const getIsSwappableToken = useGetIsSwappableToken()
  const buyList = useBuyList(symbol)

  return is.mobile() ? (
		<ExtraActions>
			<InternalLink
				icon={<ArrowForwardIosIcon style={{ fontSize: 12 }} />}
				to={`/send?token=${token}`}
				state={state}
				disabled={isWalletEmpty || !has(balance)}
			/>
		</ExtraActions>
  ) : (
		<ExtraActions>
			{!isClassic && buyList && (
				<ModalButton
					title={t("Buy {{symbol}}", { symbol })}
					renderButton={(open) => (
						<InternalButton
							icon={<MonetizationOnOutlinedIcon style={{ fontSize: 18 }} />}
							onClick={open}
						>
							{t("Buy")}
						</InternalButton>
					)}
					maxHeight={false}
				>
					<ListGroup groups={buyList} />
				</ModalButton>
			)}

			{!isClassic && token.startsWith("ibc/") && (
				<ExternalIconLink
					icon={<OpenInNewIcon style={{ fontSize: 18 }} />}
					href={`https://classic-bridge.terra.money/`}
				>
					{t("Bridge")}
				</ExternalIconLink>
			)}

			<InternalLink
				icon={<ShortcutOutlinedIcon style={{ fontSize: 18 }} />}
				to={`/send?token=${token}`}
				disabled={isWalletEmpty || !has(balance)}
			>
				{t("Send")}
			</InternalLink>

			{networkName !== "testnet" && (
				<InternalLink
					icon={<RestartAltIcon style={{ fontSize: 18 }} />}
					to="/swap"
					state={token}
					disabled={isWalletEmpty || !has(balance) || !getIsSwappableToken(token)}
				>
					{t("Swap")}
				</InternalLink>
			)}
		</ExtraActions>
  );
}

export default AssetActions

/* helpers */
const useGetIsSwappableToken = () => {
  const networkName = useNetworkName()
  const isClassic = useIsClassic()
  const { data: pairs } = useCW20Pairs()
  const { data: TFMTokens } = useTFMTokens()

  return (token: TerraAddress) => {
    if (isDenomTerraNative(token)) return true
    if (networkName === "testnet") return false
    if (isClassic) {
      if (!pairs) return false
      const terraswapAvailableList = uniq(flatten(Object.values(pairs)))
      return terraswapAvailableList.find(({ assets }) => assets.includes(token))
    } else {
      if (!TFMTokens) return false
      return TFMTokens.find(({ contract_addr }) => token === contract_addr)
    }
  }
}
