import { PropsWithChildren } from "react"
import classNamesBind from "classnames/bind";
import styles from "./Toggle.module.scss"

const cx = classNamesBind.bind(styles);

interface Props {
  checked: boolean
  onChange: () => void
  large?: boolean
}

const Toggle = (props: PropsWithChildren<Props>) => {
  const { checked, onChange, children, large } = props

  return (
    <button
      className={cx(styles.toggle, { checked, large })}
      onClick={onChange}
    >
      <span className={styles.track}>
        <span className={styles.indicator} />
      </span>
      <span className={styles.text}>{children}</span>
    </button>
  )
}

export default Toggle
