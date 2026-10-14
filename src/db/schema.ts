import { pgTable, serial, text, integer, timestamp, boolean, real } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  avatar: text("avatar").notNull(),
  bio: text("bio"),
  city: text("city").notNull().default("Buenos Aires"),
  address: text("address"),
  age: integer("age").notNull().default(25),
  rating: real("rating").notNull().default(5.0),
  totalReviews: integer("total_reviews").notNull().default(0),
  hoursBalance: integer("hours_balance").notNull().default(3),
  verified: boolean("verified").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const skillsOffered = pgTable("skills_offered", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  category: text("category").notNull(), // 'tech', 'languages', 'music', 'beauty', 'trades', 'cooking', 'fitness', 'business', 'academic'
  description: text("description"),
  durationHours: integer("duration_hours").notNull().default(1),
  availability: text("availability").notNull(),
  mode: text("mode").notNull().default("ambos"), // 'presencial', 'virtual', 'ambos'
  level: text("level").default("Intermedio"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const skillsWanted = pgTable("skills_wanted", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  fromUserId: integer("from_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  toUserId: integer("to_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  action: text("action").notNull(), // 'like', 'pass', 'superlike'
  isMatch: boolean("is_match").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const exchanges = pgTable("exchanges", {
  id: serial("id").primaryKey(),
  user1Id: integer("user1_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  user2Id: integer("user2_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  user1SkillTitle: text("user1_skill_title").notNull(),
  user2SkillTitle: text("user2_skill_title").notNull(),
  user1Availability: text("user1_availability"),
  user2Availability: text("user2_availability"),
  status: text("status").notNull().default("pending"), // 'pending', 'confirmed', 'completed', 'cancelled'
  mode: text("mode").notNull().default("presencial"), // 'presencial', 'virtual'
  locationOrLink: text("location_or_link"),
  scheduledDate: text("scheduled_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  exchangeId: integer("exchange_id"),
  senderId: integer("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  receiverId: integer("receiver_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  proposalData: text("proposal_data"), // JSON string if attached proposal
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  exchangeId: integer("exchange_id").references(() => exchanges.id, { onDelete: "cascade" }),
  fromUserId: integer("from_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  toUserId: integer("to_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  skillTaught: text("skill_taught"),
  createdAt: timestamp("created_at").defaultNow(),
});
