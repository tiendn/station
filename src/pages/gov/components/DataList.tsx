import classNamesBind from "classnames/bind";
import { Grid } from "components/layout";
import { Contents } from "types/components";
import styles from "./DataList.module.scss";

const cx = classNamesBind.bind(styles);

interface Props {
	list: Contents;
	type: "horizontal" | "vertical" | "rowList";
}

const DataList = ({ list, type }: Props) => {
	return (
		<div className={cx(styles.list, type)}>
			{list.map(({ title, content }, index) => (
				<Grid gap={4} key={index}>
					<h1 className={styles.title}>{title}</h1>
					<section>{content}</section>
				</Grid>
			))}
		</div>
	);
};

export default DataList;
