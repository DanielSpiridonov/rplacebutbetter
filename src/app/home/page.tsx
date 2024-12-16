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
    <div
      id="bg"
      className="overflow-hidden w-screen h-screen max-w-full zoom sm:overflow-scroll"
    >
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

      {/* <svg
        className="absolute bottom-5  text-black cursor-pointer border-solid border-2 p-2 rounded-full border-black hover:scale-110"
        fill="#000000"
        height="80px"
        width="80px"
        version="1.1"
        id="Capa_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 324.99 324.99"
        xmlSpace="preserve"
      >
        <g>
          <path
            d="M307.6,129.885c-11.453-11.447-23.783-16.778-38.805-16.778c-6.189,0-12.056,0.858-17.729,1.688
		c-5.094,0.745-9.905,1.449-14.453,1.45c-8.27,0-14.197-2.397-19.82-8.017c-10.107-10.101-8.545-20.758-6.569-34.25
		c2.357-16.096,5.291-36.127-15.101-56.508C183.578,5.932,167.848,0.081,148.372,0.081c-37.296,0-78.367,21.546-99.662,42.829
		C17.398,74.205,0.1,115.758,0,159.917c-0.1,44.168,17.018,85.656,48.199,116.82c31.077,31.061,72.452,48.168,116.504,48.171
		c0.005,0,0.007,0,0.013,0c44.315,0,86.02-17.289,117.428-48.681c17.236-17.226,32.142-44.229,38.9-70.471
		C329.291,173.738,324.517,146.793,307.6,129.885z M309.424,202.764c-6.16,23.915-20.197,49.42-35.763,64.976
		c-29.145,29.129-67.833,45.17-108.946,45.169c-0.002,0-0.009,0-0.011,0c-40.849-0.003-79.211-15.863-108.023-44.659
		C27.777,239.36,11.908,200.896,12,159.944c0.092-40.962,16.142-79.512,45.191-108.545c19.071-19.061,57.508-39.317,91.18-39.317
		c16.18,0,29.056,4.669,38.269,13.877c16.127,16.118,13.981,30.769,11.71,46.28c-2.067,14.116-4.41,30.115,9.96,44.478
		c7.871,7.866,16.864,11.529,28.304,11.528c5.421-0.001,10.895-0.802,16.189-1.576c5.248-0.768,10.676-1.562,15.992-1.562
		c7.938,0,18.557,1.508,30.322,13.267C317.724,156.971,313.562,186.699,309.424,202.764z"
          />
          <path
            d="M142.002,43.531c-1.109,0-2.233,0.065-3.342,0.192c-15.859,1.824-27.33,16.199-25.571,32.042
		c1.613,14.631,13.93,25.665,28.647,25.665c1.105,0,2.226-0.065,3.332-0.191c15.851-1.823,27.326-16.191,25.581-32.031
		C169.032,54.57,156.716,43.531,142.002,43.531z M143.7,89.317c-0.652,0.075-1.313,0.113-1.963,0.113
		c-8.59,0-15.778-6.441-16.721-14.985c-1.032-9.296,5.704-17.729,15.016-18.8c0.655-0.075,1.317-0.114,1.971-0.114
		c8.587,0,15.775,6.446,16.72,14.993C159.747,79.816,153.006,88.247,143.7,89.317z"
          />
          <path
            d="M102.997,113.64c-1.72-7.512-6.261-13.898-12.784-17.984c-4.597-2.881-9.889-4.404-15.304-4.404
		c-10.051,0-19.254,5.079-24.618,13.587c-4.14,6.566-5.472,14.34-3.75,21.888c1.715,7.52,6.261,13.92,12.799,18.018
		c4.596,2.88,9.888,4.402,15.303,4.402c10.051,0,19.255-5.078,24.624-13.593C103.401,128.975,104.726,121.193,102.997,113.64z
		 M89.111,129.16c-3.153,5.001-8.563,7.986-14.469,7.986c-3.158,0-6.246-0.889-8.93-2.57c-3.817-2.393-6.471-6.128-7.472-10.518
		c-1.008-4.417-0.227-8.97,2.2-12.819c3.153-5.001,8.562-7.987,14.468-7.987c3.158,0,6.246,0.89,8.933,2.573
		c3.806,2.384,6.454,6.11,7.458,10.493C92.312,120.743,91.534,125.306,89.111,129.16z"
          />
          <path
            d="M70.131,173.25c-3.275,0-6.516,0.557-9.63,1.654c-15.055,5.301-23.05,21.849-17.821,36.892
		c4.032,11.579,14.984,19.358,27.254,19.358c3.276,0,6.517-0.556,9.637-1.652c15.065-5.301,23.053-21.854,17.806-36.896
		C93.346,181.029,82.397,173.25,70.131,173.25z M75.589,218.182c-1.836,0.646-3.738,0.973-5.655,0.973
		c-7.168,0-13.566-4.543-15.921-11.302c-3.063-8.814,1.636-18.518,10.476-21.63c1.83-0.645,3.729-0.973,5.643-0.973
		c7.165,0,13.56,4.542,15.914,11.304C89.12,205.37,84.429,215.072,75.589,218.182z"
          />
          <path
            d="M140.817,229.415c-3.071-1.066-6.266-1.606-9.496-1.606c-12.307,0-23.328,7.804-27.431,19.429
		c-2.566,7.317-2.131,15.185,1.229,22.151c3.349,6.943,9.204,12.163,16.486,14.696c3.075,1.071,6.274,1.614,9.51,1.614
		c12.3,0,23.314-7.811,27.409-19.439c2.574-7.31,2.143-15.175-1.216-22.145C153.958,237.165,148.103,231.945,140.817,229.415z
		 M147.206,262.275c-2.407,6.834-8.873,11.425-16.091,11.425c-1.888,0-3.759-0.318-5.563-0.947c-4.253-1.48-7.67-4.524-9.623-8.575
		c-1.965-4.074-2.219-8.68-0.718-12.957c2.408-6.825,8.883-11.411,16.11-11.411c1.888,0,3.759,0.317,5.561,0.942
		c4.248,1.475,7.663,4.52,9.616,8.573C148.46,253.399,148.711,257.998,147.206,262.275z"
          />
          <path
            d="M212.332,213.811c-5.466,0-10.81,1.55-15.448,4.479c-13.525,8.521-17.652,26.427-9.193,39.927
		c5.315,8.445,14.463,13.488,24.469,13.488c5.458,0,10.796-1.545,15.434-4.464c13.541-8.507,17.663-26.419,9.19-39.926
		C231.486,218.86,222.345,213.811,212.332,213.811z M221.205,257.082c-2.725,1.715-5.853,2.622-9.045,2.622
		c-5.857,0-11.207-2.946-14.307-7.87c-4.947-7.896-2.513-18.39,5.433-23.395c2.724-1.72,5.852-2.629,9.047-2.629
		c5.854,0,11.192,2.944,14.283,7.878C231.577,241.597,229.151,252.09,221.205,257.082z"
          />
          <path
            d="M255.384,141.998c-1.06-0.117-2.134-0.176-3.194-0.176c-14.772,0-27.174,11.068-28.846,25.747
		c-0.876,7.698,1.297,15.266,6.118,21.311c4.812,6.03,11.686,9.821,19.369,10.676c1.053,0.114,2.12,0.173,3.175,0.173
		c14.754,0,27.164-11.067,28.869-25.748c0.886-7.688-1.277-15.247-6.091-21.288C269.97,146.651,263.082,142.853,255.384,141.998z
		 M268.955,172.602c-1.001,8.624-8.287,15.127-16.948,15.127c-0.621,0-1.251-0.034-1.86-0.101c-4.48-0.498-8.494-2.712-11.303-6.231
		c-2.819-3.534-4.089-7.963-3.575-12.47c0.98-8.611,8.255-15.104,16.922-15.104c0.623,0,1.256,0.035,1.875,0.104
		c4.498,0.499,8.523,2.717,11.334,6.244C268.209,163.697,269.472,168.114,268.955,172.602z"
          />
        </g>
      </svg> */}

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
      <div className="w-[22rem] h-18 bg-[#939393] absolute left-5 bottom-5 gap-2 p-1 flex flex-wrap rounded-lg border-solid border-black border-2 justify-center drop-shadow-lg">
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
