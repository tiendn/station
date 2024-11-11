import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNetwork } from "data/wallet";
import { queryKey, RefetchOptions } from "../query";

export const useNodeInfo = () => {
	const { lcd } = useNetwork();

	return useQuery({
		queryKey: [queryKey.tendermint.nodeInfo],
		queryFn: async () => {
			const { data } = await axios.get("node_info", { baseURL: lcd });
			return data;
		},
		...RefetchOptions.INFINITY,
	});
};
