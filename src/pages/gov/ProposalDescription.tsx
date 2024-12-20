import { Fragment, useState } from "react"
import { useTranslation } from "react-i18next"
import xss from "xss"
import { ExternalLink } from "components/general"
import { Grid } from "components/layout"
import { TooltipIcon } from "components/display"
import { Checkbox, FormHelp, FormWarning } from "components/form"
import { ProposalResult } from "data/queries/gov"

const ProposalDescription = ({ proposal }: { proposal: ProposalResult }) => {
	const { summary } = proposal;

	const { t } = useTranslation();
	const [showOriginal, setShowOriginal] = useState(false);

	const urlRegex = /(https?:\/\/[^\s]+)/g;
	const parts = summary.split(urlRegex);

	const showCheckbox = !!parts.filter((part) => part.match(urlRegex) && !isWhitelisted(part))
		.length;

	const renderPart = (part: string) => {
		const url = xss(part.match(urlRegex)?.[0] ?? "");

		if (!url) return part.split("\\n").map((x, i) => <div>{x}</div>);

		if (isWhitelisted(url))
			return (
				<ExternalLink href={part} icon={true}>
					{part}
				</ExternalLink>
			);

		if (showOriginal) return part;

		const tooltip = (
			<TooltipIcon
				content={t(
					"References to websites outside the Terra ecosystem are not displayed in the proposal description"
				)}
			>
				<i>{t("external link")}</i>
			</TooltipIcon>
		);

		return <>[{tooltip}]</>;
	};

	return (
		<Grid gap={20}>
			<div>
				{parts.map((part, index) => (
					<Fragment key={index}>{renderPart(part)}</Fragment>
				))}
			</div>

			{showCheckbox && (
				<Grid gap={4}>
					<FormHelp>
						{t(
							"References to websites outside the Terra ecosystem are not displayed in the proposal description"
						)}
					</FormHelp>
					<FormWarning>
						{t(
							"Never supply your seed phrase, password, or private key to an external website unless you are absolutely certain you are interacting with a trusted service"
						)}
					</FormWarning>
					<Checkbox
						checked={showOriginal}
						onChange={() => setShowOriginal(!showOriginal)}
					>
						{t("Display original proposal description")}
					</Checkbox>
				</Grid>
			)}
		</Grid>
	);
}

export default ProposalDescription

const isWhitelisted = (url?: string) => {
  if (!url) return false
  return new URL(url).hostname.endsWith("terra.money")
}
