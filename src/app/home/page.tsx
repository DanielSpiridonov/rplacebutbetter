"use client";

import { auth, db, firebaseObserver } from "@/lib/FirebaseUserClient";
import { Pixel } from "@/lib/server/testFunctions";
import { User, browserLocalPersistence, signOut } from "firebase/auth";
import { addDoc, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
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
    if (!auth.currentUser) {
      router.push("/login");
    }
    return () => {
      firebaseObserver.unsubscribe("authStateChanged");
    };
  }, []);

  useEffect(() => {
    console.log(pixels);
  }, [pixels]);

  useEffect(() => {
    const ref = doc(db, "/pixels/pixels/");
    getDoc(ref).then((r) => {
      const allPixels = r.data()!.values as Pixel[];
      setPixels(allPixels);
    });

    // Set up a real-time listener for document changes
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      if (snapshot.exists()) {
        const updatedPixels = snapshot.data().values as Pixel[];
        setPixels(updatedPixels);
      }
    });

    // Clean up the listener on unmount
    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  const logout = () => {
    signOut(auth);
    router.push("/login");
  };
  const populateDb = () => {
    let allRows: Pixel[][] = [];
    for (let y = 0; y < 120; y++) {
      const currentRow = [];
      for (let x = 0; x < 152; x++) {
        currentRow.push({
          color: "#FFFFFF",
          x: x,
          y: y,
        });
      }
      allRows.push(currentRow);
      //add currentRow to pixels
    }

    const allPixels: any = [];
    allRows.forEach((row) => {
      allPixels.push(...row);
    });
    alert(allPixels.length);
    setPixels(allPixels);
    //newPixels =[] // const ref = doc(db, `/pixels/pixels/`);
    // const ref = doc(db, "pixels", "pixels");
    // setDoc(ref, { values: newPixels }).then(() => alert("pixels added!"));
  };

  const Grid = () =>
    pixels?.map((x, index) => (
      <span
        key={index}
        className="  w-[10px] h-[10px] border-solid border-black outline outline-1"
        style={{ backgroundColor: x.color }}
        onClick={() => {
          const pixelValue = x.x + x.y * 152; //umnoji po shirina
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

  if (typeof window !== "undefined") {
    window.addEventListener("keydown", (event) => {
      if (
        (event.ctrlKey || event.metaKey) && // For Mac Command Key
        (event.key === "+" || event.key === "-" || event.key === "=")
      ) {
        event.preventDefault();
      }
    });
    document.addEventListener(
      "wheel",
      function (e) {
        //hackerman
        if (Math.abs(e.deltaY) > 50) {
          e.preventDefault();
        }
      },
      {
        passive: false, // Must be false to use preventDefault
      }
    );
  }

  return (
    <div id="bg" className="overflow-hidden w-screen h-screen max-w-full zoom">
      <div>
        {auth.currentUser && (
          <div className="absolute top-10 right-10 text-black italic ">
            Hello, {auth.currentUser?.displayName}{" "}
          </div>
        )}
      </div>

      <div className="px-2 gap-0 grid grid-rows-[repeat(120, 10px)]  grid-cols-[repeat(152,10px)] bg-white ">
        <Grid />
      </div>

      <svg
        onClick={() => logout()}
        className="absolute bottom-5 right-5 text-black cursor-pointer border-solid border-2 p-2 rounded-full border-black hover:scale-110"
        fill="#000000"
        version="1.1"
        id="Capa_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="52px"
        height="52px"
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
      <div className="w-[22rem] md:max-w-lg h-18 bg-[#939393] absolute left-5 bottom-5 gap-2 p-1 flex flex-wrap rounded-lg border-solid border-black border-2 justify-center drop-shadow-lg">
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
          value={selectedColor}
        ></input>
        <h1 className="text-black"> Custom color</h1>
      </div>
    </div>
  );
}
