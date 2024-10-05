import { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAmount, sortCoins, sortDenoms } from "utils/coin";
import { toPrice } from "utils/num";
import { queryKey, RefetchOptions, useIsClassic } from "../query";
import { useCurrency } from "../settings/Currency";
import { useLCDClient } from "./lcdClient";

export const useActiveDenoms = () => {
	const lcd = useLCDClient();
	const isClassic = useIsClassic();

	return useQuery({
		queryKey: [queryKey.oracle.activeDenoms, isClassic],
		queryFn: async () => {
			if (isClassic) {
				// TODO: big problem here
				const activeDenoms = await lcd.oracle.activeDenoms();
				return sortDenoms(["uluna", ...activeDenoms]);
			} else {
				return ["uluna"];
			}
		},
		...RefetchOptions.INFINITY,
	});
};

export const useExchangeRates = () => {
	const lcd = useLCDClient();
	const isClassic = useIsClassic();

	return useQuery({
		queryKey: [queryKey.oracle.exchangeRates, isClassic],
		queryFn: async () => {
			// TODO: big problem here
			if (isClassic) return await lcd.oracle.exchangeRates();
		},
		...RefetchOptions.DEFAULT,
	});
};

export const useOracleParams = () => {
	const lcd = useLCDClient();
	const isClassic = useIsClassic();

	return useQuery({
		queryKey: [queryKey.oracle.params, isClassic],
		queryFn: async () => {
			if (isClassic) return await lcd.oracle.parameters();
		},
		...RefetchOptions.INFINITY,
	});
};

/* helpers */
type Prices = Record<Denom, Price>;
export const useMemoizedPrices = (currency: Denom) => {
	const isClassic = useIsClassic();
	const { data: exchangeRates, ...state } = useExchangeRates();

	const prices = useMemo((): Prices | undefined => {
		if (!isClassic) return { uluna: 1 };

		if (!exchangeRates) return;
		const base = toPrice(getAmount(exchangeRates, currency, "1"));

		return {
			uluna: base,
			...sortCoins(exchangeRates, currency).reduce((acc, { amount, denom }) => {
				const price = toPrice(Number(base) / Number(amount));
				return { ...acc, [denom]: price };
			}, {}),
		};
	}, [currency, exchangeRates, isClassic]);

	return { data: prices, ...state };
};

export type CalcValue = (params: CoinData) => number | undefined;
export const useMemoizedCalcValue = (denom?: Denom) => {
	const currency = useCurrency();
	const { data: memoizedPrices } = useMemoizedPrices(denom ?? currency);

	return useCallback<CalcValue>(
		({ amount, denom }) => {
			if (!memoizedPrices) return;
			return Number(amount) * Number(memoizedPrices[denom] ?? 0);
		},
		[memoizedPrices]
	);
};
