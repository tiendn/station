import { useTranslation } from "react-i18next"
import { ProposalResult, useProposalStatusItem } from "data/queries/gov";
import DateTimeRenderer from "components/display/DateTimeRenderer";
import styles from "./ProposalHeader.module.scss";

const ProposalHeader = ({ proposal }: { proposal: ProposalResult }) => {
	const { id, title, status, submit_time } = proposal;

	const { t } = useTranslation();
	const { color, label } = useProposalStatusItem(status as any);

	return (
		<header className={styles.header}>
			<section className={styles.meta}>
				<aside>{id}</aside>
				<strong className={color}>{label}</strong>
			</section>

			<h1 className={styles.title}>{title}</h1>
			<p className={styles.date}>
				{t("Submitted")}{" "}
				<DateTimeRenderer format={"localestring"}>{submit_time}</DateTimeRenderer>
			</p>
		</header>
	);
};

export default ProposalHeader
