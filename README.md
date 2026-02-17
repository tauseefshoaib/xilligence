# Xilligence - Scheme Details (Machine Test)

APK Link - https://drive.google.com/file/d/1xKrPjy3fVGQ_NZzU-coJ68YUDMpI97Dr/view?usp=sharing

Expo + TypeScript implementation of the Scheme Details screen with:
- Accordion-based sections (collapsed by default)
- JSON-driven rendering
- Local i18n labels
- Skia NAV graph
- Return analysis toggles
- Return calculator (SIP / One Time)

## Setup

1. Install dependencies
```bash
npm install
```

2. Run app
```bash
npm run start
```

3. Open on device/simulator using Expo Go / iOS Simulator / Android Emulator.

## Stack

- React Native (Expo SDK 54)
- TypeScript
- `@shopify/react-native-skia`
- Functional components + hooks

## Folder Structure

- `/xilligence/src/components` reusable UI blocks
- `/xilligence/src/screens` screen-level composition
- `/xilligence/src/data` local dummy JSON and data accessor
- `/xilligence/src/locales` i18n files and translation helper
- `/xilligence/src/utils` formatting/calculation helpers
- `/xilligence/src/constants` shared theme values

## Architecture Notes

- Screen logic lives in `SchemeDetailsScreen`.
- Presentational responsibilities are split into reusable components (`Accordion`, `NavGraph`, `SegmentedControl`, `Riskometer`, `InfoGrid`).
- All visible static labels are read from `src/locales/en.json`.
- Data is loaded from `src/data/scheme-details.json` through `getSchemeData()`.
- Missing values are guarded with fallback rendering (`N/A` / `--`).

## Assumptions

- The provided schema is the source of truth; fields missing in payload are rendered gracefully.
- Return calculator uses a fixed 12% annual return for dummy projection.
- NAV graph is downsampled for smooth rendering on larger datasets.
- Current implementation focuses on one scheme details screen from local JSON.

## Estimated Time Taken

~5 hours (including project cleanup, architecture setup, and full screen implementation).
