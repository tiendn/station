import { useTranslation } from "react-i18next"
import classNamesBind from "classnames/bind";
import LaptopOutlinedIcon from "@mui/icons-material/LaptopOutlined"
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined"
import { TERRA_VALIDATORS } from "config/constants"
import { Contacts as ContactsParams } from "types/components"
import { useValidator } from "data/queries/staking"
import { useTerraValidator } from "data/Terra/TerraAPI"
import { ReactComponent as TerraValidatorProfiles } from "styles/images/stake/TerraValidatorProfiles.svg"
import { ExternalLink, validateLink } from "components/general"
import { Card, Contacts, Flex, Grid } from "components/layout"
import ProfileIcon from "./components/ProfileIcon"
import { ValidatorJailed, ValidatorStatus } from "./components/ValidatorTag"
import useAddressParams from "./useAddressParams"
import styles from "./ValidatorCompact.module.scss"
import { isWallet } from "auth"

const cx = classNamesBind.bind(styles);

const ValidatorCompact = ({ vertical }: { vertical?: boolean }) => {
  const { t } = useTranslation()
  const address = useAddressParams()
  const { data: validator, ...state } = useValidator(address)
  const { data: TerraValidator } = useTerraValidator(address)

  if (!validator) return null

  const { operator_address } = validator
  const { status, jailed, description } = validator
  const { moniker, details, website } = description

  return (
    <Card {...state}>
      <Grid gap={16}>
        <header className={cx(styles.header, { vertical })}>
          {TerraValidator && (
            <ProfileIcon src={TerraValidator.picture} size={60} />
          )}

          <Grid gap={4}>
            <Flex gap={10} start>
              <h1 className={styles.moniker}>{moniker}</h1>
              {!isWallet.mobile() && (
                <>
                  <ValidatorStatus status={status} />
                  {jailed && <ValidatorJailed />}
                </>
              )}
            </Flex>
            {isWallet.mobile() && (
              <Flex gap={10} start>
                <ValidatorStatus status={status} />
                {jailed && <ValidatorJailed small={false} />}
              </Flex>
            )}

            {validateLink(website) && (
              <Flex gap={4} className={styles.link} start>
                <LaptopOutlinedIcon fontSize="inherit" />
                <ExternalLink href={website}>{website}</ExternalLink>
              </Flex>
            )}

            {TerraValidator?.contact?.email && (
              <Flex gap={4} className={styles.link} start>
                <EmailOutlinedIcon fontSize="inherit" />
                <ExternalLink href={`mailto:${TerraValidator.contact.email}`}>
                  {TerraValidator.contact.email}
                </ExternalLink>
              </Flex>
            )}
          </Grid>
        </header>

        {details && <p>{details}</p>}

        <Grid gap={4} className={styles.footer}>
          {(TerraValidator?.contact?.email || TerraValidator?.contact) && (
            <h2>{t("View on")}</h2>
          )}

          <Flex start gap={8} wrap className={styles.links}>
            {TerraValidator?.contact?.email && (
              <ExternalLink href={TERRA_VALIDATORS + operator_address}>
                <TerraValidatorProfiles height={36} />
              </ExternalLink>
            )}
          </Flex>

          {TerraValidator?.contact && (
            <Contacts contacts={parseContacts(TerraValidator.contact)} />
          )}
        </Grid>
      </Grid>
    </Card>
  )
}

export default ValidatorCompact

/* helpers */
const toLink = (slug: string, initial: string): string => {
  if (validateLink(slug)) return slug
  if (slug.startsWith("@")) return toLink(slug.slice(1), initial)
  return initial + slug
}

const parseContacts = ({ telegram, twitter, ...contacts }: ContactsParams) => {
  return {
    ...contacts,
    telegram: telegram && toLink(telegram, "https://t.me/"),
    twitter: twitter && toLink(twitter, "https://twitter.com/"),
  }
}
