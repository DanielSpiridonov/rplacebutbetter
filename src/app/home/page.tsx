"use client";

import { auth, db, firebaseObserver } from "@/lib/FirebaseUserClient";
import { Pixel } from "@/lib/server/testFunctions";
import { User, browserLocalPersistence, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [pixels, setPixels] = useState<Pixel[] | []>([]);
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    auth.setPersistence(browserLocalPersistence);
    // getPixels().then((pixels) => setPixels(JSON.parse(pixels)));

    firebaseObserver.subscribe("authStateChanged", (data: any) => {
      setCurrentUser(auth.currentUser);
    });
    return () => {
      firebaseObserver.unsubscribe("authStateChanged");
    };
  }, []);

  useEffect(() => {
    console.log(pixels);
  }, [pixels]);

  useEffect(() => {
    if (currentUser != null) {
      router.push("/home");
    }

    const ref = doc(db, "/pixels/pixels/");
    getDoc(ref).then((r) => {
      const allPixels = r.data().values as Pixel[];
      setPixels(allPixels);
    });
  }, [currentUser]);

  const logout = () => {
    signOut(auth);
    router.push("/login");
  };

  const Grid = () =>
    pixels.map((x, index) => (
      <span
        key={index}
        className="border-solid border-y border-x border-black w-[100px] h-[100px]"
        style={{ backgroundColor: x.color }}
        onClick={() => {
          const pixelValue = x.x + x.y * 3;
          console.log(`clicked on pixel No ${pixelValue}`);

          const _pixels = pixels.map((pixel, i) =>
            i === pixelValue ? { ...pixel, color: selectedColor } : pixel
          );

          const ref = doc(db, `/pixels/pixels/`);
          setDoc(ref, { values: _pixels });
          setPixels(_pixels as Pixel[]);
        }}
      ></span>
    ));

  return (
    <div className="">
      <div>
        {auth.currentUser && (
          <div className="absolute top-10 right-10 text-black italic ">
            Hello, {auth.currentUser?.displayName}{" "}
          </div>
        )}
      </div>
      <div className=" grid grid-rows-[repeat(3, 100px)]  grid-cols-[repeat(3,100px)] w-full h-[100vh] bg-white border-solid border-2 border-blue border-1">
        <Grid />
      </div>

      {/* <div
        onClick={() => logout()}
        className="absolute bottom-10 right-5 text-black"
      >
        Sign out
      </div> */}
      <svg
        onClick={() => logout()}
        className="absolute bottom-5 right-5 text-black cursor-pointer border-solid border-2 p-2 rounded-full border-black"
        fill="#000000"
        version="1.1"
        id="Capa_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="56px"
        height="56px"
        viewBox="0 0 492.5 492.5"
        xmlSpace="preserve"
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <g>
            {" "}
            <path d="M184.646,0v21.72H99.704v433.358h31.403V53.123h53.539V492.5l208.15-37.422v-61.235V37.5L184.646,0z M222.938,263.129 c-6.997,0-12.67-7.381-12.67-16.486c0-9.104,5.673-16.485,12.67-16.485s12.67,7.381,12.67,16.485 C235.608,255.748,229.935,263.129,222.938,263.129z"></path>{" "}
          </g>{" "}
        </g>
      </svg>
      <div className="w-1/4 h-18 bg-[#939393] absolute left-5 bottom-5 gap-2 p-1 flex flex-wrap rounded-lg border-solid border-black border-2 justify-center drop-shadow-lg">
        <div
          className="bg-black w-6 h-6 border-solid border-black border-2 rounded-2xl cursor-pointer"
          onClick={() => setSelectedColor("black")}
        ></div>
        <div
          className="bg-[#7F7F7F] w-6 h-6 border-solid border-black border-2 rounded-2xl cursor-pointer"
          onClick={() => setSelectedColor("#7F7F7F")}
        ></div>
        <div
          className="bg-[#880015] w-6 h-6 border-solid border-black border-2 rounded-2xl cursor-pointer"
          onClick={() => setSelectedColor("#880015")}
        ></div>
        <div
          className="bg-[#ED1C24] w-6 h-6 border-solid border-black border-2 rounded-2xl cursor-pointer"
          onClick={() => setSelectedColor("#ED1C24")}
        ></div>
        <div
          className="bg-[#FF7F27] w-6 h-6 border-solid border-black border-2 rounded-2xl cursor-pointer"
          onClick={() => setSelectedColor("#FF7F27")}
        ></div>
        <div
          className="bg-[#FFF200] w-6 h-6 border-solid border-black border-2 rounded-2xl cursor-pointer"
          onClick={() => setSelectedColor("#FFF200")}
        ></div>
        <div
          className="bg-[#22B14C] w-6 h-6 border-solid border-black border-2 rounded-2xl cursor-pointer"
          onClick={() => setSelectedColor("#22B14C")}
        ></div>
        <div
          className="bg-[#00A2E8] w-6 h-6 border-solid border-black border-2 rounded-2xl cursor-pointer"
          onClick={() => setSelectedColor("#00A2E8")}
        ></div>
        <div
          className="bg-[#3F48CC] w-6 h-6 border-solid border-black border-2 rounded-2xl cursor-pointer"
          onClick={() => setSelectedColor("#3F48CC")}
        ></div>
        <div
          className="bg-[#A349A4] w-6 h-6 border-solid border-black border-2 rounded-2xl cursor-pointer"
          onClick={() => setSelectedColor("#A349A4")}
        ></div>
        {/* 2nd roll */}
        <div
          className="bg-[#FFFFFF] w-6 h-6 border-solid border-black border-2 rounded-2xl cursor-pointer"
          onClick={() => setSelectedColor("#FFFFFF")}
        ></div>
        <div
          className="bg-[#C3C3C3] w-6 h-6 border-solid border-black border-2 rounded-2xl cursor-pointer"
          onClick={() => setSelectedColor("#C3C3C3")}
        ></div>
        <div
          className="bg-[#B97A57] w-6 h-6 border-solid border-black border-2 rounded-2xl cursor-pointer"
          onClick={() => setSelectedColor("#B97A57")}
        ></div>
        <div
          className="bg-[#FFAEC9] w-6 h-6 border-solid border-black border-2 rounded-2xl cursor-pointer"
          onClick={() => setSelectedColor("#FFAEC9")}
        ></div>
        <div
          className="bg-[#FFC90E] w-6 h-6 border-solid border-black border-2 rounded-2xl cursor-pointer"
          onClick={() => setSelectedColor("#FFC90E")}
        ></div>
        <div
          className="bg-[#EFE4B0] w-6 h-6 border-solid border-black border-2 rounded-2xl cursor-pointer"
          onClick={() => setSelectedColor("#EFE4B0")}
        ></div>
        <div
          className="bg-[#B5E61D] w-6 h-6 border-solid border-black border-2 rounded-2xl cursor-pointer"
          onClick={() => setSelectedColor("#B5E61D")}
        ></div>
        <div
          className="bg-[#99D9EA] w-6 h-6 border-solid border-black border-2 rounded-2xl cursor-pointer"
          onClick={() => setSelectedColor("#99D9EA")}
        ></div>
        <div
          className="bg-[#7092BE] w-6 h-6 border-solid border-black border-2 rounded-2xl cursor-pointer"
          onClick={() => setSelectedColor("#7092BE")}
        ></div>
        <div
          className="bg-[#C8BFE7] w-6 h-6 border-solid border-black border-2 rounded-2xl cursor-pointer"
          onClick={() => setSelectedColor("#C8BFE7")}
        ></div>
        <input
          className={`bg-[#939393] w-10 h-6 p-0 cursor-pointer `}
          type="color"
          id="favcolor"
          name="favcolor"
          onChange={(customvalue) => setSelectedColor(customvalue.target.value)}
        ></input>
        <h1 className="text-black"> &#8592; Custom color</h1>
      </div>
    </div>
  );
}
