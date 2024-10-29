"use client";

import {
  auth,
  firebaseObserver,
  googleProvider,
} from "@/lib/FirebaseUserClient";
import { updateName } from "@/lib/server/testFunctions";
import {
  User,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);

  useEffect(() => {
    auth.setPersistence(browserLocalPersistence);

    firebaseObserver.subscribe("authStateChanged", (data: any) => {
      setCurrentUser(auth.currentUser);
    });
    return () => {
      firebaseObserver.unsubscribe("authStateChanged");
    };
  }, []);

  useEffect(() => {
    if (currentUser != null) {
      router.push("/home");
    }
  }, [currentUser]);

  const login = async () => {
    try {
      const loginResult = await signInWithPopup(auth, googleProvider);
      setCurrentUser(loginResult.user);
      //redirect to main page
      //OR redirect to /users/currentUser.
      router.push("/home");
      createUserWithEmailAndPassword(); //ignore
    } catch (error) {
      if (error.code == "auth/popup-closed-by-user") {
        console.log("User cancelled login");
      } else {
        alert("Something went wrong, try again later!");
      }
    }
  };
  const logout = () => {
    signOut(auth);
  };
  const updateUserName = async (newName: string) => {
    const response = await updateName(newName);
    if (response.result == "success") alert("Your name has been updated!");
    else alert("sux to suck");
  };
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-[url('/pictures/adrien-olichon-RCAhiGJsUUE-unsplash.jpg')] bg-cover flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 overflow-hidden gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* <div onClick={login}>login</div> */}
      {/* <div>User name is {auth.currentUser?.displayName ?? "None, bozo"}</div>
      <div onClick={logout}>Logout</div>
      <div
        onClick={async () => {
          await updateUserName("some name123");
        }}
      >
        Call Server
      </div> */}
      <div className="bg-white w-[400px] h-[500px] flex flex-col m-auto rounded-[25px]">
        <div className="flex top-[10px] text-[black] text-5xl font-bold mt-10 ml-8 w-screen h-fit">
          Sign In
        </div>
        {/* <div className="flex text-[black] mt-14 ml-14">Email</div> */}
        <div className="flex flex-col gap-7 mx-20 mt-16 w-fit">
          <input
            className="text-[black] bg-transparent border-t-0 border-l-0 border-r-0 border-b-2 border-gray-700 dark:border-gray-200 px-3 py-2 rounded-md "
            // className="text-[black] w-4/6 mx-16 flex top-[10px] mt-16 h-fit border-solid border-2 border-black border-t-0 border-l-0 border-r-0 border-b-2  "
            type="text"
            id="lname"
            name="lname"
            placeholder="Email"
            minLength={200}
          />
          <div className="relative w-fit w-4/6">
            <input
              className="text-[black] bg-transparent border-t-0 border-l-0 border-r-0 border-b-2 border-gray-700 dark:border-gray-200 px-3 py-2 rounded-md "
              // className="text-[black] w-4/6 mx-16 flex top-[10px] mt-14 h-fit border-solid border-2 border-black border-t-0 border-l-0 border-r-0 border-b-2  "
              type={showPassword ? "text" : "password"}
              id="lname"
              name="lname"
              placeholder="Password"
            />
            <button
              type="button"
              aria-label={
                showPassword ? "Password Visible" : "Password Invisible."
              }
              className="text-black dark:text-black"
              onClick={() => {
                setShowPassword((prev) => !prev);
              }}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 select-none  cursor-pointer h-6 absolute top-2 right-2"
                  tabindex="-1"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 select-none cursor-pointer h-6 absolute top-2 right-2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  ></path>
                </svg>
              )}
            </button>
          </div>
        </div>{" "}
        <div className="flex flex-col gap-2 m-auto w-3/4">
          <div className="flex text-[white] bg-black p-3 mt-10  rounded-[25px]">
            <h1 className="m-auto">Sign In</h1>
          </div>
          <div className="flex flex-row text-black gap-2 m-auto">
            <hr className="bg-black w-28 h-0.5 b-solid rounded-[40px] mt-3" />
            <h1>or</h1>
            <hr className="bg-black w-28 h-0.5 b-solid rounded-[40px] mt-3" />
          </div>
          <div
            className="flex text-[white] bg-black p-3 cursor-pointer hover:opacity-30 transition ease-in-out delay-50 rounded-[25px]"
            onClick={login}
          >
            <Image
              src="/pictures/white-google-logo.png"
              width={30}
              height={30}
              alt="a"
            />
            <h1 className="m-auto">Sign In with Google</h1>
          </div>{" "}
        </div>
      </div>
    </div>
  );
}
