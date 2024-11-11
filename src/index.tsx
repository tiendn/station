import { StrictMode } from "react";
import { createRoot } from "react-dom/client"; // Updated import
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { getChainOptions, WalletProvider } from "@terra-money/wallet-provider";
import "tippy.js/dist/tippy.css";

import "config/lang";
import { BRIDGE } from "config/constants";

import "index.scss";
import ScrollToTop from "app/ScrollToTop";
import InitNetworks from "app/InitNetworks";
import InitWallet from "app/InitWallet";
import InitTheme from "app/InitTheme";
import ElectronVersion from "app/ElectronVersion";
import App from "app/App";

const connectorOpts = { bridge: BRIDGE };
const defaultNetwork = {
	name: "classic",
	chainID: "columbus-5",
	lcd: "https://terra-classic-lcd.publicnode.com",
	api: "https://terra-classic-public-api.publicnode.com",
	mantle: "https://columbus-mantle.terra.dev",
	walletconnectID: 2,
};

getChainOptions().then((chainOptions) => {
	const container = document.getElementById("station");
	const root = createRoot(container!); // Create root using createRoot API
	root.render(
		<StrictMode>
			<RecoilRoot>
				<BrowserRouter>
					<ScrollToTop />
					<WalletProvider
						{...chainOptions}
						defaultNetwork={defaultNetwork}
						connectorOpts={connectorOpts}
					>
						<InitNetworks>
							<InitWallet>
								<InitTheme />
								<ElectronVersion />
								<App />
							</InitWallet>
						</InitNetworks>
					</WalletProvider>
				</BrowserRouter>
			</RecoilRoot>
		</StrictMode>
	);
});
