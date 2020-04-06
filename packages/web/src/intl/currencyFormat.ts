import { RefTyped, unwrap } from "@vue-composable/core";
import {
  IntlNumberFormatLocales,
  useIntlNumberFormat,
  NumberFormatReturn
} from "./numberFormat";
import { computed, Ref } from "@vue/composition-api";
import { intlDateFormatExtractArguments } from "./_helper";
import {
  CurrencyCodes,
  IntlNumberFormatOptions,
  CurrencyDisplay
} from "./types";
export interface CurrencyFormatReturn extends NumberFormatReturn {
  formatAmount: (
    amount: RefTyped<number>,
    currency?: Readonly<RefTyped<Readonly<CurrencyCodes>>>,
    display?: RefTyped<CurrencyDisplay>
  ) => Ref<Readonly<string>>;
  formatAmountString: (
    amount: RefTyped<number>,
    currency?: Readonly<RefTyped<Readonly<CurrencyCodes>>>,
    display?: RefTyped<CurrencyDisplay>
  ) => string;
}

export function useCurrencyFormat(): CurrencyFormatReturn;
export function useCurrencyFormat(
  currencyCode: Readonly<RefTyped<Readonly<CurrencyCodes>>>
): CurrencyFormatReturn;
export function useCurrencyFormat(
  currencyCode: Ref<string> | string
): CurrencyFormatReturn;

export function useCurrencyFormat(
  currencyCode: Readonly<RefTyped<Readonly<CurrencyCodes>>>,
  locales: IntlNumberFormatLocales,
  options?: RefTyped<IntlNumberFormatOptions>
): CurrencyFormatReturn;
export function useCurrencyFormat(
  currencyCode: Ref<string> | string,
  locales: IntlNumberFormatLocales,
  options?: RefTyped<IntlNumberFormatOptions>
): CurrencyFormatReturn;

export function useCurrencyFormat(
  currencyCode: Readonly<RefTyped<Readonly<CurrencyCodes>>>,
  options: RefTyped<IntlNumberFormatOptions>
): CurrencyFormatReturn;
export function useCurrencyFormat(
  currencyCode: Ref<string> | string,
  options: RefTyped<IntlNumberFormatOptions>
): CurrencyFormatReturn;

export function useCurrencyFormat(
  currencyCode?:
    | Readonly<RefTyped<Readonly<CurrencyCodes>>>
    | string
    | Ref<string>,
  localesOptions?: IntlNumberFormatLocales | RefTyped<IntlNumberFormatOptions>,
  opts?: RefTyped<IntlNumberFormatOptions>
): CurrencyFormatReturn {
  const [locales, argOptions] = intlDateFormatExtractArguments(
    localesOptions as any,
    opts
  );

  const options = computed(() => {
    return {
      style: "currency",
      currency: unwrap(currencyCode),
      ...unwrap(argOptions)
    } as IntlNumberFormatOptions;
  });

  const numberFormat = useIntlNumberFormat(
    locales,
    options.value.currency ? options : undefined // if currency is not passed we don't need to
  );

  const formatAmountString = (
    amount: RefTyped<number>,
    currency?: Readonly<RefTyped<Readonly<CurrencyCodes>>>,
    display?: RefTyped<CurrencyDisplay>
  ) => {
    const c = unwrap(currency);
    const d = unwrap(display);
    return numberFormat.formatString(
      unwrap(amount),
      (c || d) && { currency: c, currencyDisplay: d }
    );
  };

  const formatAmount = (
    amount: RefTyped<number>,
    currency?: Readonly<RefTyped<Readonly<CurrencyCodes>>>,
    display?: RefTyped<CurrencyDisplay>
  ) => {
    return computed(() => formatAmountString(amount, currency, display));
  };

  return {
    ...numberFormat,

    formatAmount,
    formatAmountString
  };
}