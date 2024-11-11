import { useTranslation } from "react-i18next"
import { readAmount } from "terra-classic-utils";
import { combineState } from "data/query";
import { useSupply } from "data/queries/bank";
import { useStakingPool } from "data/queries/staking";
import { Card } from "components/layout";
import { ReadPercent } from "components/token";
import { Tooltip } from "components/display";
import DashboardContent from "./components/DashboardContent";
import DashboardTag from "./components/DashboardTag";
import { isWallet } from "auth";

const StakingRatio = () => {
	const { t } = useTranslation();

	const { data: stakingPool, ...stakingPoolState } = useStakingPool();
	const { data: supply, ...supplyState } = useSupply();
	const state = combineState(stakingPoolState, supplyState);

	const render = () => {
		if (!(stakingPool && supply)) return null;

		const bonded = stakingPool.bonded_tokens.amount.toString();
		const issuance = supply.find(({ denom }) => denom === "uluna")?.amount;

		if (!issuance) return null;

		const ratio = Number(bonded) / Number(issuance);
		const tooltip = t("{{amount}} Lunc staked", {
			amount: readAmount(bonded, { prefix: true, integer: true }),
		});

		return (
			<DashboardContent
				value={
					<Tooltip content={tooltip}>
						<ReadPercent>{ratio}</ReadPercent>
					</Tooltip>
				}
				footer={
					!isWallet.mobile() && (
						<DashboardTag>
							{[t("Staked Lunc"), t("Total Lunc")].join(" / ")}
						</DashboardTag>
					)
				}
			/>
		);
	};

	return (
		<Card
			{...state}
			title={t("Staking ratio")}
			size="small"
			extra={
				isWallet.mobile() && (
					<DashboardTag>{[t("Staked Lunc"), t("Total Lunc")].join(" / ")}</DashboardTag>
				)
			}
		>
			{render()}
		</Card>
	);
};

export default StakingRatio
