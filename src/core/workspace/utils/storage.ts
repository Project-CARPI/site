import { z } from "zod";

import {
  CURRENT_STORAGE_VERSION,
  VersionedContainerSchema,
} from "@/core/workspace/utils/schemas";

/**
 * Tries to load data from localStorage with version migration support.
 * * Strategy:
 * 1. Parse JSON.
 * 2. Check if it's the current version -> Validate & Return.
 * 3. Check if it's a legacy array (v0) -> Validate & Return (Auto-migrate).
 * 4. Fallback -> Return null (caller should provide default).
 */
export function loadVersionedData<T>(
  key: string,
  schema: z.ZodSchema<T>,
): T | null {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const parsed = JSON.parse(stored);

    // load versioned data
    const versionedResult = VersionedContainerSchema.safeParse(parsed);

    if (versionedResult.success) {
      const { version, data } = versionedResult.data;

      // matches current version, validate data against schema
      if (version === CURRENT_STORAGE_VERSION) {
        const dataResult = schema.safeParse(data);
        if (dataResult.success) {
          return dataResult.data;
        } else {
          console.error(
            `Data for ${key} (v${version}) failed schema validation:`,
            dataResult.error,
          );
          return null;
        }
      }

      /**
       * FOR FUTURE VERSIONS:
       *
       * If we introduce a new version with breaking changes, we can add an
       * `else if (version < CURRENT_STORAGE_VERSION)` block here to handle
       * migrations from older versions to the current one. This way, we can
       * preserve user data across updates without forcing resets.
       */

      console.warn(
        `Version mismatch for ${key}. Got v${version}, expected v${CURRENT_STORAGE_VERSION}. Resetting.`,
      );
      return null;
    }

    // Fallback: Check for Legacy Data (v0 - raw arrays)
    // If the top-level item is NOT a version object, it might be the old raw array.
    const legacyResult = schema.safeParse(parsed);
    if (legacyResult.success) {
      console.info(
        `Migrating legacy (v0) data for ${key} to v${CURRENT_STORAGE_VERSION}.`,
      );
      return legacyResult.data;
    }

    // data is unrecognizable
    console.warn(`Data for ${key} was corrupted or unrecognizable. Resetting.`);
    return null;
  } catch (e) {
    console.error(`Failed to load ${key}`, e);
    return null;
  }
}

/**
 * Saves data to localStorage wrapped in the version object.
 */
export function saveVersionedData<T>(key: string, data: T) {
  try {
    const payload = {
      version: CURRENT_STORAGE_VERSION,
      data: data,
    };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch (e) {
    // sometimes localStorage can throw (e.g. quota exceeded, private mode),
    // we catch errors to avoid crashing the app
    console.error(`Failed to save ${key}`, e);
  }
}
