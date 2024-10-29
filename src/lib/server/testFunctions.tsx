"use server";

export const hiMom = async () => {
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  console.log("this retard is calling again..");
  await wait(3000);
  return { person: "Mom", message: "Hi!" };
};
export const updateName = async (newName: string) => {
  console.log("Writing to database");
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  await wait(1200);
  console.log(`User Name updated to ${newName}`);
  return { result: "success" };
};

export const getPixels = async () => {
  // const db = firebase.firestore(getApp());
  const db = getFirestore(getApp());

  const val = await db.doc("/pixels/pixels").get();
  console.log(val.data());
  return JSON.stringify(val.data().values);
};

export type Pixel = {
  color: string;
  lastUpdate: Date;
  x: number;
  y: number;
};
