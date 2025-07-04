import { createRxDatabase, addRxPlugin } from "rxdb";
import { RxDatabase, RxCollection, RxJsonSchema } from "rxdb";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { wrappedValidateAjvStorage } from "rxdb/plugins/validate-ajv";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";

addRxPlugin(RxDBDevModePlugin);

export interface MatchDocType {
  id?: string;
  date: string;
  time: string;
  location: string;
  team1: string[];
  team2: string[];
}

const matchSchema: RxJsonSchema<MatchDocType> = {
  title: "match schema",
  description: "stores tennis matches",
  version: 0,
  type: "object",
  primaryKey: "id",
  properties: {
    id: {
      type: "string",
      final: true,
      maxLength: 100,
    },
    date: { type: "string" },
    time: { type: "string" },
    location: { type: "string" },
    team1: { type: "array", items: { type: "string" } },
    team2: { type: "array", items: { type: "string" } },
  },
  required: ["date", "time", "location", "team1", "team2"],
};

export type MatchCollection = RxCollection<MatchDocType>;
export type MatchDatabase = RxDatabase<{ matches: MatchCollection }>;

let dbPromise: Promise<MatchDatabase> | null = null;

export const getDb = async (): Promise<MatchDatabase> => {
  if (!dbPromise) {
    dbPromise = createRxDatabase<{ matches: MatchCollection }>({
      name: "matchesdb",
      storage: wrappedValidateAjvStorage({
        storage: getRxStorageDexie(),
      }),
      ignoreDuplicate: true,
    }).then(async (db) => {
      await db.addCollections({
        matches: {
          schema: matchSchema,
        },
      });
      return db;
    });
  }
  return dbPromise;
};
