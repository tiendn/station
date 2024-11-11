import { useTranslation } from "react-i18next"
import classNamesBind from "classnames/bind";
import { useIsClassic } from "data/query"
import { Col, Page } from "components/layout"
import LunaPrice from "./LunaPrice"
import TaxRate from "./TaxRate"
import Issuance from "./Issuance"
import CommunityPool from "./CommunityPool"
import StakingRatio from "./StakingRatio"
import Charts from "./Charts"
import styles from "./Dashboard.module.scss"
import { isWallet } from "auth"

const cx = classNamesBind.bind(styles);

const Dashboard = () => {
  const { t } = useTranslation()
  const isClassic = useIsClassic()

  return (
    <Page title={isWallet.mobile() ? "" : t("Dashboard")}>
      <Col>
        <header className={cx(styles.header, { trisect: !isClassic })}>
          {isClassic && <LunaPrice />}
          {isClassic && <TaxRate />}
          <Issuance />
          <CommunityPool />
          <StakingRatio />
        </header>

        <Charts />
      </Col>
    </Page>
  )
}

export default Dashboard
