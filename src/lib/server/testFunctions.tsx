"use server";

export const updateName = async (newName: string) => {
  console.log("Writing to database");
  const wait = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms));
  await wait(1200);
  console.log(`User Name updated to ${newName}`);
  return { result: "success" };
};

export const getPixels = async () => {
  // const db = firebase.firestore(getApp());
  // @ts-ignore
  const db = getFirestore(getApp());

  const val = await db.doc("/pixels/pixels").get();
  console.log(val.data());
  return JSON.stringify(val.data().values);
};

export type Pixel = {
  color: string;
  x: number;
  y: number;
};

export const serverTime = () => {
  return Date.now();
};
