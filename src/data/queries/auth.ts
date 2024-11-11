import { useQuery } from "@tanstack/react-query";
import { queryKey, RefetchOptions } from "../query";
import { useAddress } from "../wallet";
import { useLCDClient } from "./lcdClient";

export const useAccountInfo = () => {
	const address = useAddress();
	const lcd = useLCDClient();

	return useQuery({
		queryKey: [queryKey.auth.accountInfo],
		queryFn: async () => {
			if (!address) throw new Error("Wallet is not connected");
			return await lcd.auth.accountInfo(address);
		},
		...RefetchOptions.DEFAULT,
	});
};
