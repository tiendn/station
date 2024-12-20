import { useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import { Coins, Rewards, ValAddress, Validator } from "@terra-money/terra.js";
import { has } from "utils/num";
import { sortCoins } from "utils/coin";
import { queryKey, RefetchOptions } from "../query";
import { useAddress } from "../wallet";
import { useLCDClient } from "./lcdClient";
import { CalcValue } from "./oracle";

export const useRewards = () => {
	const address = useAddress();
	const lcd = useLCDClient();

	return useQuery({
		queryKey: [queryKey.distribution.rewards, address],
		queryFn: async () => {
			if (!address) return { total: new Coins(), rewards: {} };
			return await lcd.distribution.rewards(address);
		},
		...RefetchOptions.DEFAULT,
	});
};

export const useCommunityPool = () => {
	const lcd = useLCDClient();

	return useQuery({
		queryKey: [queryKey.distribution.communityPool],
		queryFn: () => lcd.distribution.communityPool(),
		...RefetchOptions.INFINITY,
	});
};

/* commission */
export const useValidatorCommission = () => {
	const lcd = useLCDClient();
	const address = useAddress();

	return useQuery({
		queryKey: [queryKey.distribution.validatorCommission],
		queryFn: async () => {
			if (!address) return new Coins();
			const validatorAddress = ValAddress.fromAccAddress(address);
			return await lcd.distribution.validatorCommission(validatorAddress);
		},
		...RefetchOptions.DEFAULT,
	});
};

export const useWithdrawAddress = () => {
	const lcd = useLCDClient();
	const address = useAddress();

	return useQuery({
		queryKey: [queryKey.distribution.withdrawAddress],
		queryFn: async () => {
			if (!address) return;
			return await lcd.distribution.withdrawAddress(address);
		},
		...RefetchOptions.DEFAULT,
	});
};

/* hooks */
export const getConnectedMoniker = (address?: string, validators?: Validator[]) => {
	if (!(address && validators)) return;

	const validatorAddress = ValAddress.fromAccAddress(address);
	const validator = validators.find(
		({ operator_address }) => operator_address === validatorAddress
	);

	if (!validator) return;

	return validator.description.moniker;
};

/* helpers */
export const calcRewardsValues = (rewards: Rewards, currency: Denom, calcValue: CalcValue) => {
	const calc = (coins: Coins) => {
		const list = sortCoins(coins, currency).filter(({ amount }) => has(amount));
		const sum = BigNumber.sum(...list.map((item) => calcValue(item) ?? 0)).toString();

		return { sum, list };
	};

	const total = calc(rewards.total);
	const byValidator = Object.entries(rewards.rewards)
		.map(([address, coins]) => ({ ...calc(coins), address }))
		.filter(({ sum }) => has(sum))
		.sort(({ sum: a }, { sum: b }) => Number(b) - Number(a));

	return { total, byValidator };
};
