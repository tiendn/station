import { useMemo } from "react"
import { LCDClient } from "@terra-money/feather.js";
import { useNetwork } from "data/wallet";
import { useIsClassic } from "data/query";

export const useLCDClient = () => {
	const network = useNetwork();
	const isClassic = useIsClassic();
	const lcdClient = useMemo(() => {
		return new LCDClient({
			[network.chainID]: {
				chainID: network.chainID,
				lcd: network.lcd,
				prefix: "terra",
				isClassic: isClassic,
				gasAdjustment: 1.75,
				gasPrices: { ulunc: 0.15, uluna: 0.15 },
			},
		});
	}, [isClassic, network.chainID, network.lcd]);

	return lcdClient;
};
