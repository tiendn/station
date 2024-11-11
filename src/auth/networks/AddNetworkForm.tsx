import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useNetworkState } from "data/wallet"
import { useCustomNetworks } from "data/settings/CustomNetworks"
import { Form, FormItem, Submit, Input, Checkbox } from "components/form"
import { useNetworks } from "app/InitNetworks"

const AddNetwork = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { classic } = useNetworks();
  const [, setNetwork] = useNetworkState()
  const { add, validateName } = useCustomNetworks()

  /* form */
  const form = useForm<CustomNetwork>({ mode: "onChange" })
  const { register, watch, handleSubmit, formState } = form
  const { errors, isValid } = formState
  const { preconfigure } = watch()

  const submit = (values: CustomNetwork) => {
    add(values)
    setNetwork(values.name)
    navigate("/wallet")
  }

  return (
		<Form onSubmit={handleSubmit(submit)}>
			<FormItem label={t("Name")} error={errors.name?.message}>
				<Input
					{...register("name", {
						required: true,
						validate: {
							exists: (value) =>
								!validateName(value) ? `${value} already exists` : undefined,
						},
					})}
					placeholder={classic.name}
					autoFocus
				/>
			</FormItem>

			<FormItem label={t("Chain ID")} error={errors.chainID?.message}>
				<Input {...register("chainID", { required: true })} placeholder={classic.chainID} />
			</FormItem>

			<FormItem label={t("LCD")} error={errors.lcd?.message}>
				<Input {...register("lcd", { required: true })} placeholder={classic.lcd} />
			</FormItem>

			<Checkbox {...register("preconfigure")} checked={preconfigure}>
				{t("Preconfigure accounts")}
			</Checkbox>

			<Submit disabled={!isValid} />
		</Form>
  );
}

export default AddNetwork
