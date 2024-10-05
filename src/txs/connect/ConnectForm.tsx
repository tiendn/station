import { useEffect, useState, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"

import { AccAddress } from "@terra-money/feather.js";
import { Card, Flex, FlexColumn, Grid } from "components/layout"
import { Form } from "components/form"
import Tx from "../Tx"
import { RN_APIS, WebViewMessage } from "utils/rnModule"
import { useNavigate } from "react-router-dom"
import GridConfirm from "components/layout/GridConfirm"
import styles from "./Connect.module.scss"
import { ReactComponent as WalletConnectIcon } from "styles/images/menu/Walletconnect.svg"
import { LoadingCircular } from "../../components/feedback"
import { toast } from "react-toastify"

interface TxValues {
  recipient?: string
  address?: AccAddress
  input?: number
  memo?: string
}

interface Props {
  action: any
  payload: any
}

const ConnectForm = ({ action, payload }: Props) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [peerData, setPeerData] = useState<any>(null)
  const [tx, setTx] = useState<any>(null)
  const connectionTimeout = useRef<ReturnType<typeof setTimeout>>()

  /* form */
  const form = useForm<TxValues>({ mode: "onChange" })
  const { handleSubmit } = form

  const readyConnect = async () => {
    try {
      connectionTimeout.current = setTimeout(() => {
        navigate("/wallet", { replace: true })
        toast.error("Session timeout", { toastId: "session-timeout" })
      }, 15000)

      const res = await WebViewMessage(RN_APIS.READY_CONNECT_WALLET, {
        uri: decodeURIComponent(payload),
      })

      clearTimeout(connectionTimeout.current)

      setPeerData(res)
    } catch (error) {
      console.error("readyConnect", error)
    }
  }

  useEffect(() => {
    peerData && setPeerData(null)
    if (payload) {
      setTx({
        onPost() {
          navigate("/wallet", { replace: true })
        },
      })

      readyConnect()
    }

    return () => {
      clearTimeout(connectionTimeout.current)
    }
  }, [action, payload])

  if (!peerData) {
    return (
      <FlexColumn gap={20} className={styles.screen}>
        <LoadingCircular size={36} />
        <p>Ready to Connect</p>
      </FlexColumn>
    )
  }

  return (
    <Tx {...tx}>
      {({ connect }) => (
        <Form onSubmit={handleSubmit(connect.fn)}>
          {peerData && (
            <GridConfirm button={connect.button} className={styles.connect}>
              <Grid>
                <Flex>
                  <WalletConnectIcon />
                </Flex>
                <Flex>
                  <h1>{peerData.name} request to connect your wallet</h1>
                </Flex>
                <Card className={styles.detail}>
                  <Grid gap={16}>
                    <div>
                      <h2>{t("Connect")}</h2>
                      <p>{peerData.url}</p>
                    </div>
                    <div>
                      <h2>{t("Description")}</h2>
                      <p>{peerData.description}</p>
                    </div>
                  </Grid>
                </Card>
              </Grid>
            </GridConfirm>
          )}
        </Form>
      )}
    </Tx>
  )
}

export default ConnectForm
