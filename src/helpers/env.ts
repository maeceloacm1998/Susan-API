import { z } from "zod";
import dotEnv from "dotenv";
dotEnv.config();

const EnvSchema = z.object({
  MONGODB_URI: z
    .string({
      description: "MongoDB Connection string",
      required_error: "😱 You forgot to add a database URL",
    })
    .url()
    .min(3),
  DB_NAME: z
    .string({
      description: "Database name",
      required_error: "😱 You forgot to add a database name",
    })
    .min(3)
    .max(50)
    .default("SearchMed"),
  DB_USER: z
    .string({
      description: "Database user",
      required_error: "😱 You forgot to add a database user",
    })
    .min(3)
    .max(50),
  DB_PASS: z
    .string({
      description: "Database password",
      required_error: "😱 You forgot to add a database password",
    })
    .min(3)
    .max(50),
  PORT: z.coerce
    .number({
      description:
        ".env files convert numbers to strings, therefoore we have to enforce them to be numbers",
    })
    .positive()
    .max(65536, `options.port should be >= 0 and < 65536`)
    .default(3000),
});

export const env = EnvSchema.parse(process.env);
