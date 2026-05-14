import { mysqlTable, varchar, text, timestamp, boolean, int, decimal, primaryKey } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(), // Add password for local auth
  phone: varchar("phone", { length: 50 }),
  role: varchar("role", { length: 50 }).notNull().default("applicant"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const applications = mysqlTable("applications", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  program: varchar("program", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("draft"),
  submittedAt: timestamp("submitted_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
  birthPlace: varchar("birth_place", { length: 255 }),
  birthDate: varchar("birth_date", { length: 50 }),
  gender: varchar("gender", { length: 50 }),
  address: text("address"),
  phone: varchar("phone", { length: 50 }),
  previousSchool: varchar("previous_school", { length: 255 }),
  gradYear: varchar("grad_year", { length: 10 }),
  major: varchar("major", { length: 255 }),
  participantNumber: varchar("participant_number", { length: 50 }),
  selectionCode: varchar("selection_code", { length: 100 }),
  score: int("score"),
  reRegistrationPaid: boolean("re_registration_paid").default(false),
});

export const announcements = mysqlTable("announcements", {
  id: varchar("id", { length: 255 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  type: varchar("type", { length: 50 }).notNull().default("info"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const documents = mysqlTable("documents", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  url: text("url").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const payments = mysqlTable("payments", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  method: varchar("method", { length: 100 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  category: varchar("category", { length: 100 }).notNull().default("registration"), // Added category
  transactionId: varchar("transaction_id", { length: 255 }).notNull(),
  paidAt: timestamp("paid_at"),
});

export const feeConfigs = mysqlTable("fee_configs", {
  id: varchar("id", { length: 255 }).primaryKey(),
  description: varchar("description", { length: 255 }).notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const activityLogs = mysqlTable("activity_logs", {
  id: varchar("id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }),
  action: varchar("action", { length: 100 }).notNull(),
  details: text("details").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.id] }),
}));
