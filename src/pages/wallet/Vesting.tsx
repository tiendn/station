import { useTranslation } from "react-i18next"
import { useIsClassic } from "data/query"
import { Account, isVestingAccount, useAccount } from "data/queries/vesting";
import { parseVestingSchedule } from "data/queries/vesting"
import { readNativeDenom } from "data/token"
import { Card } from "components/layout"
import { Read } from "components/token"
import Asset from "./Asset"
import VestingScheduleTable from "./VestingScheduleTable"
import VestingSchedules from "./VestingSchedules"
import styles from "./Vesting.module.scss"
import { isWallet } from "auth"

const Vesting = () => {
  const { t } = useTranslation()
  const isClassic = useIsClassic()
  const { data, ...state } = useAccount()

  if (!data) return null
  if (!isVestingAccount(data)) return null

  const schedule = parseVestingSchedule(data as Account);

  return (
    <Card {...state} title={t("Vesting")}>
      <Asset
        {...readNativeDenom("uluna", isClassic)}
        balance={schedule.amount.total}
        hideActions
      />

      {isWallet.mobile() ? (
        <VestingSchedules {...schedule} />
      ) : (
        <>
          <section className={styles.amount}>
            <dl>
              <dt>{t("Vested")}</dt>
              <dd>
                <Read amount={schedule.amount.vested} />
              </dd>
            </dl>
          </section>
          <VestingScheduleTable {...schedule} />
        </>
      )}
    </Card>
  )
}

export default Vesting
