import { Grid } from "components/layout"
import LastHeight from "./LastHeight"
import Links from "./Links"
import styles from "./Aside.module.scss"

const Aside = () => {
  return (
		<Grid gap={20} className={styles.aside}>
			<Links />
			<LastHeight />
			<p style={{ fontSize: 11, color: "hsl(240 9% 66%)", opacity: 0.75 }}>
				Commit {process.env.REACT_APP_VERSION}
			</p>
		</Grid>
  );
}

export default Aside
