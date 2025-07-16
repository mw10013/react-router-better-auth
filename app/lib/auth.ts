import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

export const auth = betterAuth({
  database: new Database("./sqlite.db"),
  user: {
    modelName: "User",
    // fields: {
    // 	email: "emailAddress",
    // name: "fullName"
    // },
    // additionalFields: {
    // 	customField: {
    // 		type: "string",
    // 	}
    // },
    // changeEmail: {
    // 	enabled: true,
    // 	sendChangeEmailVerification: async ({ user, newEmail, url, token }) => {
    // 		// Send change email verification
    // 	}
    // },
    // deleteUser: {
    // 	enabled: true,
    // 	sendDeleteAccountVerification: async ({ user, url, token }) => {
    // 		// Send delete account verification
    // 	},
    // 	beforeDelete: async (user) => {
    // 		// Perform actions before user deletion
    // 	},
    // 	afterDelete: async (user) => {
    // 		// Perform cleanup after user deletion
    // 	}
    // }
  },
  session: {
    modelName: "Session",
  },
  account: {
    modelName: "Account",
  },
  verification: {
    modelName: "Verification",
  },

  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    database: {
      generateId: false,
      useNumberId: true,
    },
  },
});
