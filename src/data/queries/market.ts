import { useQuery } from "@tanstack/react-query";
import { queryKey, RefetchOptions } from "../query";
import { useLCDClient } from "./lcdClient";

export const useMarketParams = () => {
	const lcd = useLCDClient();
	return useQuery({
		queryKey: [queryKey.market.params],
		queryFn: () => lcd.market.parameters(),
		...RefetchOptions.INFINITY,
	});
};
