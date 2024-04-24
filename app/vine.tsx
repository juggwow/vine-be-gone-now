"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  CardActions,
} from "@mui/material";
import { url } from "inspector";
import { Head } from "next/document";
import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  ChangeEvent,
} from "react";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import DeleteIcon from "@mui/icons-material/Delete";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocationOffIcon from "@mui/icons-material/LocationOff";
import CancelIcon from "@mui/icons-material/Cancel";
import SendIcon from "@mui/icons-material/Send";
import uploadPhoto from "@/lib/upload-photo";
import { Karnfaifa } from "@/type/vine-be-gone-now";
import { RequestData, Geolocation } from "@/type/vine-be-gone-now";
import Webcam from "react-webcam";
import WebAssetOffIcon from "@mui/icons-material/WebAssetOff";
import liff from "@line/liff";

const videoConstraints = {
  width: 640,
  height: 640,
  facingMode: "environment",
};

const findBusinessArea = async (
  lat: number,
  lon: number,
): Promise<Karnfaifa | null> => {
  const res = await fetch("/api/lat-lon-to-aoj", {
    method: "POST",
    body: JSON.stringify({
      lat,
      lon,
    }),
  });
  if (res.status != 200) {
    return null;
  }
  return (await res.json()) as Karnfaifa;
};

export default function VineBeGoneNow() {
  const webcamRef = useRef<Webcam>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [displayName, setDisplayname] = useState("");
  const [positionError, setPositionError] = useState<string>("");
  const [geolocation, setGeolocation] = useState<Geolocation>({
    lat: "0.0000",
    lon: "0.0000",
    karnfaifa: null,
  });

  useEffect(() => {
    const initialLiff = async () => {
      try {
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID as string });
      } catch (error) {
        console.error("liff init error");
      }
      if (!liff.isLoggedIn()) {
        liff.login();
      } else {
        setDisplayname((await liff.getProfile()).displayName);
      }
    };
    initialLiff();
  }, []);

  const handleGeolocationError = (error: GeolocationPositionError) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setPositionError("ผู้ใช้ปฏิเสธคำขอตำแหน่ง");
        break;
      case error.POSITION_UNAVAILABLE:
        setPositionError("ไม่พบข้อมูลตำแหน่ง");
        break;
      case error.TIMEOUT:
        setPositionError("หมดเวลาคำขอตำแหน่ง");
        break;
    }
  };

  const handleCancel = () => {
    setGeolocation({
      lat: "0.0000",
      lon: "0.0000",
      karnfaifa: null,
    });
    setUrl(null);
    formRef.current?.reset();
    setLocation();
  };

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setUrl(imageSrc);
    }
    console.log(imageSrc);
  }, [webcamRef]);

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!url || !geolocation.karnfaifa) {
      return;
    }

    const uploadedImage = await uploadPhoto(url);
    if (!uploadedImage) {
      return;
    }

    const form = formRef.current;
    if (!form) {
      return;
    }

    const body: RequestData = {
      ...geolocation,
      riskPoint: form["riskPoint"].value,
      place: form["place"].value,
      uploadedImage,
    };
    const res = await fetch("/api/vine-be-gone-now/report-risk", {
      method: "POST",
      body: JSON.stringify(body),
    });

    handleCancel();
  };

  const handleCloseWindow =async () => {
    liff.closeWindow()
  }

  const setLocation = useCallback(async () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setGeolocation({
          lat: position.coords.latitude.toFixed(6).toString(),
          lon: position.coords.longitude.toFixed(6).toString(),
          karnfaifa: await findBusinessArea(
            position.coords.latitude,
            position.coords.longitude,
          ),
        });
      },
      (error) => {
        handleGeolocationError(error);
        setGeolocation({
          lat: "0.0000",
          lon: "0.0000",
          karnfaifa: null,
        });
      },
    );
  }, []);

  useEffect(() => {
    setLocation();
  }, []);
  return (
    <>
      <div className="flex flex-col justify-center items-center mt-3">
        {!url && (
          <Webcam
            className="w-full h-[400px] max-w-[400px]"
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />
        )}
        {url && <img className="h-[400px]" src={url} />}
        {!geolocation.karnfaifa && (
          <p className="w-full max-w-[400px]">
            พื้นที่รับผิดชอบ อยู่นอกเขตการไฟฟ้ส่วนภูมิภาคเขต 3 ภาคใต้ (ยะลา)
          </p>
        )}
        {positionError != "" && (
          <p className="w-full max-w-[400px]">
            ไม่สามารถเข้าถึงพิกัด GPS ของคุณได้ กรุณาลองเปิด GPS
            และโหลดหน้านี้ใหม่อีกครั้ง
          </p>
        )}
        {geolocation.karnfaifa && (
          <ul className="w-full max-w-[400px]">
            <li className="flex flex-row align-middle mt-3">
              <ElectricBoltIcon />
              <span>พื้นที่รับผิดชอบ: {geolocation.karnfaifa?.fullName}</span>
            </li>
            <li className="flex flex-row align-middle my-3">
              <LocationOnIcon />
              พิกัด: {geolocation.lat}, {geolocation.lon}
            </li>
          </ul>
        )}
        {positionError == "" && geolocation.karnfaifa && (
          <form
            ref={formRef}
            className="w-full flex flex-col max-w-[400px] justify-center"
          >
            <label className="w-full" htmlFor="riskPoint">
              ลักษณะจุดเสี่ยง
            </label>
            <input
              required
              className="w-5/6 outline-1 outline-red-400 bg-inherit border-2 border-slate-400 rounded-lg px-3 py-2"
              type="text"
              id="riskPoint"
            />
            <label className="w-full mt-3" htmlFor="place">
              หมายเลขเสา/สถานที่
            </label>
            <input
              required
              className="w-5/6 mb-6 outline-1 outline-red-400 bg-inherit border-2 border-slate-400 rounded-lg px-3 py-2"
              type="text"
              id="place"
            />

            {url && (
              <button
                type="submit"
                className="fixed right-3 bottom-10 ring-2 hover:ring-offset-2 rounded-full ring-slate-400 text-slate-400 p-3"
              >
                <SendIcon />
              </button>
            )}
          </form>
        )}

        {positionError == "" && url && geolocation && (
          <button
            onClick={() => handleCancel()}
            className="fixed right-3 bottom-24 ring-2 hover:ring-offset-2 rounded-full ring-slate-400 text-slate-400 p-3"
          >
            <CancelIcon />
          </button>
        )}
        {positionError == "" && !url && geolocation && (
          <button
            onClick={() => handleCapture()}
            className="fixed right-3 bottom-10 ring-2 hover:ring-offset-2 rounded-full ring-slate-400 text-slate-400 p-3"
          >
            <AddAPhotoIcon fontSize="medium" />
          </button>
        )}
        <button onClick={()=>handleCloseWindow()} className="fixed right-3 bottom-[152px] ring-2 hover:ring-offset-2 rounded-full ring-slate-400 text-slate-400 p-3">
          <WebAssetOffIcon />
        </button>
      </div>
    </>
  );
}
