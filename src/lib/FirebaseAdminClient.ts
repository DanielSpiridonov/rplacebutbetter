"use server";
import { app } from "firebase-admin";
import { applicationDefault, cert, initializeApp } from "firebase-admin/app";
import firebase from "firebase/compat/app";

export const getApp = () => {
  if (!firebase.apps.length) {
    const adminCreds = require("./passion-project-e8a02-firebase-adminsdk-ubc3q-0cec6d7df1.json");
    initializeApp({
      credential: cert(adminCreds),
      databaseURL: "https://passion-project-e8a02.firebaseio.com/",
    });
    console.error(app);
  }
  return app;
};
