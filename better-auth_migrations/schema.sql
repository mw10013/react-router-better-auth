create table "User" ("id" integer not null primary key autoincrement, 
"name" text not null, 
"email" text not null unique, 
"emailVerified" integer not null, 
"image" text, 
"createdAt" date not null, 
"updatedAt" date not null);

create table "Session" ("id" integer not null primary key autoincrement, 
"expiresAt" date not null, 
"token" text not null unique, 
"createdAt" date not null, 
"updatedAt" date not null, 
"ipAddress" text, 
"userAgent" text, 
"userId" integer not null references "User" ("id"));

create table "Account" ("id" integer not null primary key autoincrement, 
"accountId" text not null, 
"providerId" text not null, 
"userId" integer not null references "User" ("id"), 
"accessToken" text, 
"refreshToken" text, 
"idToken" text, 
"accessTokenExpiresAt" date, 
"refreshTokenExpiresAt" date, 
"scope" text, 
"password" text, 
"createdAt" date not null, 
"updatedAt" date not null);

create table "Verification" ("id" integer not null primary key autoincrement, 
"identifier" text not null, 
"value" text not null, 
"expiresAt" date not null, 
"createdAt" date, 
"updatedAt" date);