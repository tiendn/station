import { QueryKey, useQuery, useQueryClient } from "@tanstack/react-query";
import { atom, useSetRecoilState } from "recoil";
import { queryKey } from "../query";
import { useLCDClient } from "./lcdClient";
import { useEffect } from "react";

interface LatestTx {
	txhash: string;
	redirectAfterTx?: { label: string; path: string };
	queryKeys?: QueryKey[];
}

export const latestTxState = atom<LatestTx>({
	key: "latestTx",
	default: { txhash: "" },
});

export const isBroadcastingState = atom({
	key: "isBroadcasting",
	default: false,
});

export const useTxInfo = ({ txhash, queryKeys }: LatestTx) => {
	const setIsBroadcasting = useSetRecoilState(isBroadcastingState);
	const queryClient = useQueryClient();
	const lcd = useLCDClient();

	const query = useQuery({
		queryKey: [queryKey.tx.txInfo, txhash],
		queryFn: () => lcd.tx.txInfo(txhash),
		enabled: !!txhash,
		retry: true,
		retryDelay: 1000,
	});

	// Handle onSettled
	useEffect(() => {
		if (query.status === "success" || query.status === "error") {
			setIsBroadcasting(false);
		}
	}, [query.status, setIsBroadcasting]);

	// Handle onSuccess
	useEffect(() => {
		if (query.isSuccess) {
			queryKeys?.forEach((key) => {
				queryClient.invalidateQueries({ queryKey: key });
			});

			queryClient.invalidateQueries({ queryKey: queryKey.History });
			queryClient.invalidateQueries({ queryKey: queryKey.bank.balance });
			queryClient.invalidateQueries(queryKey.tx.create);
		}
	}, [query.isSuccess, queryKeys, queryClient]);

	return query;
};
