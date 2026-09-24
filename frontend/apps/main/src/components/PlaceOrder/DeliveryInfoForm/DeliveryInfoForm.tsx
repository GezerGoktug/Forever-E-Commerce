import { Controller, useFormContext } from "react-hook-form";
import styles from "./DeliveryInfoForm.module.scss";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { Input } from "@forever/ui-kit";
import { isEmptyString } from "@forever/common-utils";

const ErrorModal = lazy(() => import("@/components/PlaceOrder/ErrorModal/ErrorModal"));

type CountryData = {
  country: string;
  city: string[];
};

const DeliveryInfoForm = () => {
  const form = useFormContext();

  const [isOpen, setIsOpen] = useState(false);
  const [countryData, setCountryData] = useState<CountryData[]>([]);

  const selectedCountry = form.watch("country");
  const selectedCity = form.watch("city");

  useEffect(() => {
    if (form.formState.isSubmitting && !form.formState.isValid) {
      setIsOpen(true);
    }
  }, [form.formState.isSubmitting, form.formState.isValid])

  useEffect(() => {
    const fetchCountriesData = async () => {
      const response = await fetch("/@forever-static/data/country.json");
      const countries = await response.json();
      setCountryData(countries);
    };
    fetchCountriesData();
  }, []);

  const countriesOptions = useMemo(() => countryData.map((item) => ({
    value: item.country,
    label: item.country,
  })), [countryData]);

  const cityOptions = useMemo(() =>
    countryData
      .find((item) => item.country === selectedCountry)
      ?.city
      ?.map((city) => ({ value: city, label: city })) ?? [],
    [selectedCountry, countryData]);

  const cityValue = isEmptyString(selectedCity) ? null : { value: selectedCity, label: selectedCity };

  const closeErrorModal = () => setIsOpen(false);

  return (
    <div className={styles.delivery_info_form_wrapper}>
      <Suspense fallback={<></>}>
        <ErrorModal
          open={isOpen}
          errors={form.formState.errors}
          closeModal={closeErrorModal}
        />
      </Suspense>
      <h6>
        DELIVERY
        <span>INFORMATION</span>
      </h6>
      <div className={styles.delivery_info_form}>
        <div className={styles.delivery_info_form_input_group}>
          <Input
            className={styles.delivery_info_form_input}
            placeholder="First name"
            {...form.register("firstName")}
          />
          <Input
            className={styles.delivery_info_form_input}
            placeholder="Last name"
            {...form.register("lastName")}
          />
        </div>
        <Input
          className={styles.delivery_info_form_input}
          placeholder="Email address"
          type="email"
          {...form.register("email")}
        />
        <Input
          className={styles.delivery_info_form_input}
          placeholder="Street"
          {...form.register("street")}
        />
        <div className={styles.delivery_info_form_input_group}>
          <Select
            placeholder="Select a country"
            className={styles.delivery_info_form_select}
            onChange={(e) => {
              form.setValue("country", e?.value || "");
              form.setValue("city", "")
            }}
            options={countriesOptions}
            classNamePrefix="react-select"
            isSearchable
            isClearable
          />
          <Select
            isDisabled={isEmptyString(selectedCountry)}
            placeholder="Select a city"
            className={styles.delivery_info_form_select}
            onChange={(e) => form.setValue("city", e?.value)}
            value={cityValue}
            options={cityOptions}
            classNamePrefix="react-select"
            isSearchable
            isClearable
          />
        </div>
        <div className={styles.delivery_info_form_input_group}>
          <Input
            className={styles.delivery_info_form_input}
            placeholder="Zipcode"
            {...form.register("zipCode")}
          />
          <Input
            className={styles.delivery_info_form_input}
            placeholder="State"
            {...form.register("state")}
          />
        </div>
        <Controller
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <Input
              mask="0 (000) 000 00 00"
              className={styles.delivery_info_form_input}
              placeholder="Phone Number"
              {...field}
            />
          )}
        />
      </div>
    </div>
  );
};

export default DeliveryInfoForm;
