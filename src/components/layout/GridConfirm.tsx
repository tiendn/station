import { PropsWithChildren, ReactNode } from "react"
import classNames from "classnames"
import styles from "./Grid.module.scss"

interface Props {
  className?: string
  button?: ReactNode
}

const GridConfirm = (props: PropsWithChildren<Props>) => {
  const { className, children, button } = props
  return (
    <div className={classNames(styles.confirm, className)}>
      {children}
      <div className={styles.buttons}>{button}</div>
    </div>
  )
}

export default GridConfirm
