/* src/utils/unit.tsx */
import { createContext, useContext } from 'react';

/* ------------------------------------------------------------------ */
/* 1️⃣  Types & Enums                                               */
/* ------------------------------------------------------------------ */

export type WeightUnit =
  | 'gram'
  | 'kilogram'
  | 'pound'
  | 'ounce';

export type VolumeUnit =
  | 'liter'
  | 'milliliter'
  | 'cup'
  | 'teaspoon'   // teaspoon
  | 'tablespoon'; // tablespoon

// A union that covers every supported unit – handy for the generic API.
export type Unit = WeightUnit | VolumeUnit;

/* ------------------------------------------------------------------ */
/* 2️⃣  Conversion tables (to base units)                           */
/* ------------------------------------------------------------------ */

export const weightToBase: Record<WeightUnit, number> = {
  gram:   1,
  kilogram:  1000,
  pound:  453.59237,
  ounce:  28.3495231,
};

export const volumeToBase: Record<VolumeUnit, number> = {
  liter:    1,
  milliliter:   0.001,
  cup:  0.24,          // US cup
  teaspoon:  0.00492892,    // US teaspoon
  tablespoon: 0.0147868,     // US tablespoon
};

// Export the raw unit lists – useful for consumers that need to iterate.
export const weightUnits = Object.keys(weightToBase) as string[];
export const volumeUnits = Object.keys(volumeToBase) as string[];

/**
 * Returns true if `unit` is a weight unit.
 */
export function isWeight(unit: string): unit is string {
  return weightUnits.includes(unit);
}

/**
 * Returns true if `unit` is a volume unit.
 */
export function isVolume(unit: Unit): unit is VolumeUnit {
  return volumeUnits.includes(unit);
}

/* ------------------------------------------------------------------ */
/* 3️⃣  Helper functions                                            */
/* ------------------------------------------------------------------ */

/**
 * Convert a weight value to the base unit (grams).
 */
export const toBaseWeight = (value: number, from: WeightUnit): number =>
  value * weightToBase[from];

/**
 * Convert a volume value to the base unit (liters).
 */
export const toBaseVolume = (value: number, from: VolumeUnit): number =>
  value * volumeToBase[from];

/**
 * Convert a value in grams to any supported weight unit.
 */
export const fromBaseWeight = (valueInGrams: number, to: WeightUnit): number =>
  valueInGrams / weightToBase[to];

/**
 * Convert a value in liters to any supported volume unit.
 */
export const fromBaseVolume = (valueInLiters: number, to: VolumeUnit): number =>
  valueInLiters / volumeToBase[to];

/**
 * Generic conversion – figures out whether the units are weight or
 * volume and delegates to the appropriate helper.
 *
 * @param value   The numeric amount you want to convert.
 * @param from    Source unit (e.g. 'lb', 'cup').
 * @param to      Target unit (must be of the same type as `from`).
 * @returns       Converted number rounded to 6 decimal places.
 */
export const convertFromBase = ({
  value,
  to
} : {
  value: number,
  to: string
}): number => {
  // Quick sanity check – units must belong to the same family.
  const isWeight =
    (Object.keys(weightToBase) as WeightUnit[]).includes(to as WeightUnit);
  const isVolume =
    (Object.keys(volumeToBase) as VolumeUnit[]).includes(to as VolumeUnit);

  if (!isWeight && !isVolume) {
    throw new Error(`Unsupported result unit: ${to}`);
  }

  // If the target unit belongs to a different family, throw.
  // const sameFamily = isWeight
  //   ? (Object.keys(weightToBase) as WeightUnit[]).includes(to as WeightUnit)
  //   : (Object.keys(volumeToBase) as VolumeUnit[]).includes(to as VolumeUnit);

  // if (!sameFamily) {
  //   throw new Error(
  //     `Cannot convert between different families: ${from} → ${to}`
  //   );
  // }

  // Perform the conversion.
  let result: number;
  if (isWeight) {
    // const base = toBaseWeight(value, from as WeightUnit);
    result = fromBaseWeight(value, to as WeightUnit);
  } else {
    // const base = toBaseVolume(value, from as VolumeUnit);
    result = fromBaseVolume(value, to as VolumeUnit);
  }

  // Round to avoid floating‑point noise.
  return Number(result.toFixed(6));
};

export const convertToBase = ({
  value,
  from,
} : {
  value: number,
  from: string,
}): number => {
  // Quick sanity check – units must belong to the same family.
  const isWeight =
    (Object.keys(weightToBase) as WeightUnit[]).includes(from as WeightUnit);
  const isVolume =
    (Object.keys(volumeToBase) as VolumeUnit[]).includes(from as VolumeUnit);

  if (!isWeight && !isVolume) {
    throw new Error(`Unsupported result unit: ${from}`);
  }

  // Perform the conversion.
  let result: number;
  if (isWeight) {
    result = toBaseWeight(value, from as WeightUnit);
    // result = fromBaseWeight(value, from as WeightUnit);
  } else {
    result = toBaseVolume(value, from as VolumeUnit);
    // result = fromBaseVolume(value, to as VolFumeUnit);
  }

  // Round to avoid floating‑point noise.
  return Number(result.toFixed(6));
};

/* ------------------------------------------------------------------ */
/* 4️⃣  React context & hook                                        */
/* ------------------------------------------------------------------ */

/**
 * The context simply holds the `convert` function – you could extend it
 * later with more utilities (e.g. formatting, locale support).
 */
// const UnitConversionContext = createContext<typeof convert>(convert);

// /**
//  * Provider that can be used at the root of your app.
//  *
//  * @example
//  * ```tsx
//  * <UnitConversionProvider>
//  *   <App />
//  * </UnitConversionProvider>
//  * ```
//  */
// export const UnitConversionProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => (
//   <UnitConversionContext.Provider value={convert}>
//     {children}
//   </UnitConversionContext.Provider>
// );

// /**
//  * Hook that gives you direct access to the conversion function.
//  *
//  * @example
//  * ```tsx
//  * const convert = useUnitConversion();
//  * const toCups = convert(2, 'cup');
//  * ```
//  */
// export const useUnitConversion = (): typeof convert =>
//   useContext(UnitConversionContext);
