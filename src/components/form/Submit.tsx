import { ButtonHTMLAttributes } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "components/general"
import styles from "./Form.module.scss"
import { LoadingCircular } from "../feedback"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  submitting?: boolean
}

const Submit = ({ submitting, ...attrs }: Props) => {
  const { t } = useTranslation()

  return (
    <Button
      {...attrs}
      icon={submitting && <LoadingCircular size={18} />}
      disabled={attrs.disabled || submitting}
      type={attrs.type ?? "submit"}
      className={styles.submit}
      color="primary"
      block
    >
      {attrs.children || t("Submit")}
    </Button>
  )
}

export default Submit
