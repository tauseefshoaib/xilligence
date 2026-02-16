import rawData from './scheme-details.json';

export type ReturnPoint = {
  month: string;
  percentage: number | string;
};

export type NavPoint = {
  nav: number;
  nav_date: string;
  adjusted_nav?: number;
  scheme_code?: number;
};

export type AnalyticsData = {
  beta?: string;
  alpha?: string;
  pescore?: string;
  plan_id?: number;
  treynor?: string;
  rsquared?: string;
  isin_code?: string;
  as_on_date?: string;
  Drawdown_1Y?: string;
  Drawdown_3Y?: string;
  sharpe_ratio?: string;
  sortino_ratio?: string;
  DividendYield_1Y?: string;
  DividendYield_3Y?: string;
  information_ratio?: string;
  standard_deviation?: string;
  [key: string]: string | number | undefined;
};

export type FrequencyDetail = {
  id?: number;
  scheme_code?: string;
  sip_frequency?: string;
  sip_minimum_gap?: number;
  sip_maximum_gap?: number;
  sip_installment_gap?: number;
  sip_minimum_installment_amount?: number;
  sip_maximum_installment_amount?: number;
  sip_minimum_installment_numbers?: number;
  sip_maximum_installment_numbers?: number;
  created_on?: number;
  modified_on?: number;
  mf_scheme_id?: number;
};

export type SectorDetail = {
  sector_code?: number;
  isin?: string;
  sector_name?: string;
  percentage_assets?: number;
};

export type HoldingData = {
  id?: number;
  scheme_code?: string;
  isin?: string;
  holdings_percentages?: number;
  holding_value?: number;
  instrument_description?: string;
  Company_names?: string;
  mf_scheme_id?: number;
  modified_on?: number;
};

export type HoldingAssetAllocation = {
  asset_name?: string;
  asset_percentage?: number;
};

export type FundManager = {
  date_from?: string;
  isin_code?: string;
  person_id?: number;
  person_name?: string;
  person_type?: string;
};

export type SchemeDuration = {
  duration_value?: number;
  duration?: string;
  NAV?: number;
};

export type SchemeData = {
  scheme_id?: number;
  scheme_name?: string;
  scheme_code?: string;
  isin?: string;
  min_lumpsum_amount?: number;
  benchmark_index_name?: string;
  category_id?: number;
  category_name?: string;
  sub_category_id?: number;
  sub_category_name?: string;
  amc_name?: string;
  amc_code?: string;
  amc_color_codes?: string;
  amc_id?: number;
  amc_address1?: string;
  amc_phone?: string;
  amc_full_name?: string;
  amc_address2?: string;
  amc_address3?: string;
  amc_address4?: string;
  amc_address5?: string;
  aum_value?: string;
  nav_date?: string;
  nav_value?: number;
  nav_change_percentage?: string;
  min_investment?: number;
  one_year_return?: number;
  investor_rating?: string;
  investor_rating_text?: string;
  weekly?: number;
  monthly?: number;
  three_month?: number;
  six_month?: number;
  three_year_return?: number;
  five_year_return?: number;
  description?: string;
  amc_image_icons?: string;
  lock_in_period?: string;
  exit_load?: string;
  rta?: string;
  listing_date?: string;
  plan_type?: string;
  min_sip_amount?: number;
  fund_rating?: string;
  colour_name?: string;
  scheme_sip_freequency?: string;
  riskometer_value?: string;
  scheme_objective?: string;
  minimum_amount?: number;
  scheme_type_ai?: string;
  scheme_description_ai?: string;
  bajaj_amc_id?: number;
  purchase_allowed?: string;
  sip_flag?: string;
  is_index_fund?: number;
  is_etf_fof_fund?: number;
  analytics_data?: AnalyticsData;
  expense_ratio?: number;
  sip_returns?: ReturnPoint[];
  lumpsum_return?: ReturnPoint[];
  is_user_wishlist_added?: number;
  is_user_cart_added?: number;
  frequency_details?: FrequencyDetail[];
  mf_sector_details?: SectorDetail[];
  latest_nav?: number;
  latest_nav_date?: string;
  per_day_nav?: string;
  per_day_nav_percentage?: string;
  nav_json?: NavPoint[];
  holdings_data?: HoldingData[];
  holding_asset_allocation?: HoldingAssetAllocation[];
  fund_managers?: FundManager[];
  scheme_duration?: SchemeDuration[];
  sip_frequency?: string;
  [key: string]: unknown;
};

export type Payload = {
  success?: string;
  result?: {
    mf_schemes?: SchemeData[];
  }[];
  successMessage?: string;
  errorMessage?: string;
};

export function getSchemeData(): SchemeData {
  const payload = rawData as Payload;
  return payload.result?.[0]?.mf_schemes?.[0] ?? {};
}

export function getSchemePayload(): Payload {
  return rawData as Payload;
}
