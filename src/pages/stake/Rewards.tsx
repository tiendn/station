import { useTranslation } from "react-i18next"
import { useCurrency } from "data/settings/Currency"
import { combineState } from "data/query"
import { calcRewardsValues, useRewards } from "data/queries/distribution"
import { useExchangeRates } from "data/queries/oracle"
import { useMemoizedCalcValue } from "data/queries/oracle"
import { WithTokenItem } from "data/token"
import { ModalButton, Mode } from "components/feedback"
import { TokenCard, TokenCardGrid } from "components/token"
import { TooltipIcon } from "components/display"
import StakedCard from "./components/StakedCard"
import RewardsTooltip from "./RewardsTooltip"
import is from "auth/scripts/is"

const Rewards = () => {
  const { t } = useTranslation()
  const currency = useCurrency()
  const calcValue = useMemoizedCalcValue(currency)

  const { data: rewards, ...rewardsState } = useRewards()
  const { data: exchangeRates, ...exchangeRatesState } = useExchangeRates()
  const state = combineState(rewardsState, exchangeRatesState)

  /* render */
  const title = t("Staking rewards")
  const render = () => {
    if (!rewards) return null
    const { total } = calcRewardsValues(rewards, currency, calcValue)
    const { sum, list } = total
    const amount = list.find(({ denom }) => denom === "uluna")?.amount ?? "0"

    return (
      <ModalButton
        title={title}
        modalType={is.mobile() ? Mode.FULL_CARD : Mode.DEFAULT}
        renderButton={(open) => (
          <StakedCard
            {...state}
            title={
              <TooltipIcon content={<RewardsTooltip />} placement="bottom">
                {title}
              </TooltipIcon>
            }
            amount={amount}
            value={sum}
            onClick={open}
          >
            {list.length > 1 &&
              `+${t("{{length}} coins", { length: list.length - 1 })}`}
          </StakedCard>
        )}
      >
        <TokenCardGrid>
          {list.map(({ amount, denom }) => (
            <WithTokenItem token={denom} key={denom}>
              {(item) => (
                <TokenCard
                  {...item}
                  amount={amount}
                  value={calcValue({ amount, denom })}
                />
              )}
            </WithTokenItem>
          ))}
        </TokenCardGrid>
      </ModalButton>
    )
  }

  return render()
}

export default Rewards
