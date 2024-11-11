import { useQuery } from "@tanstack/react-query";
import { isDenomIBC } from "terra-classic-utils";
import { queryKey, RefetchOptions } from "../query";
import { useLCDClient } from "./lcdClient";

export const useIBCBaseDenom = (denom: Denom, enabled: boolean) => {
	const lcd = useLCDClient();

	return useQuery({
		queryKey: [queryKey.ibc.denomTrace, denom],
		queryFn: async () => {
			const { base_denom } = await lcd.ibcTransfer.denomTrace(denom.replace("ibc/", ""));

			return base_denom;
		},
		...RefetchOptions.INFINITY,
		enabled: isDenomIBC(denom) && enabled,
	});
};
