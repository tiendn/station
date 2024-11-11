import { readPercent } from "terra-classic-utils";

const Uptime = ({ children: value }: { children: number }) => {
	return <span>{readPercent(value, { fixed: 2 })}</span>;
};

export default Uptime;
