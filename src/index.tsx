import { StrictMode } from "react";
import { createRoot } from "react-dom/client"; // Updated import
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { getChainOptions } from "@terra-money/wallet-controller";
import { WalletProvider } from "@terra-money/wallet-provider";
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

getChainOptions().then((chainOptions) => {
	const container = document.getElementById("station");
	const root = createRoot(container!); // Create root using createRoot API
	root.render(
		<StrictMode>
			<RecoilRoot>
				<BrowserRouter>
					<ScrollToTop />
					<WalletProvider {...chainOptions} connectorOpts={connectorOpts}>
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
