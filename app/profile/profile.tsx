"use client";
import liff from "@line/liff";
import {
  LegacyRef,
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useFormState } from "react-dom";
import { addProfile, getProfile } from "./action";
import SendIcon from "@mui/icons-material/Send";
import { useRouter, useSearchParams } from "next/navigation";
import WebAssetOffIcon from "@mui/icons-material/WebAssetOff";
import { useAlertLoading } from "../components/loading";

const initialState = {
  message: "",
};

export default function ProfileForm() {
  const searchParams = useSearchParams();
  const { loading } = useAlertLoading();
  const [state, formAction] = useFormState(addProfile, initialState);
  const router = useRouter();
  const [invalidMsg, setInvalidMsg] = useState("");
  const [userID, setUserID] = useState<string>("");
  const [profile, setProfile] = useState({
    mobileno: "",
    name: "",
  });

  const closeOnSuccessForm = useMemo(() => {
    return searchParams.get("closewindow");
  }, [searchParams]);

  useEffect(() => {
    const initialLiff = async () => {
      loading(true);
      try {
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_PROFILE_ID as string });
      } catch (error) {
        console.error("liff init error");
      }

      const os = liff.getOS()
      if(os == "web" && process.env.NEXT_PUBLIC_VERSION as string == "production"){
        router.push("/error")
      }

      if (!liff.isLoggedIn()) {
        liff.login({ redirectUri: "/profile" });
      }
      const sub = (await liff.getProfile()).userId;
      setUserID(sub);

      if (!(await liff.getFriendship()).friendFlag) {
        window.open("https://line.me/ti/p/@409wseyb");
      }

      

      setProfile(await getProfile(sub));
      loading(false);
    };
    initialLiff();
  }, []);

  useEffect(() => {
    if (state.message == "") return;
    if (state.message.includes("error")) {
      liff.closeWindow();
      return;
    }
    if (state.message.includes("invalid")) {
      setInvalidMsg(state.message.split(", ")[1]);
      return;
    }
    if (closeOnSuccessForm && closeOnSuccessForm == "ok") {
      liff.closeWindow();
      return;
    }
    router.push(state.message);
  }, [state]);

  const handleFormAction = (e:FormData)=>{
    loading(true)
    formAction(e)
    loading(false)
  }

  const handleCloseWindow = () => {
    liff.closeWindow();
  };
  return (
    <div className="flex flex-col align-middle items-center">
      <form
        action={(e)=>{handleFormAction(e)}}
        className="w-full flex flex-col p-1 max-w-[400px] justify-center"
      >
        <p className="w-full text-lg mb-6">แก้ไข/เพิ่มข้อมูลผู้ใช้งาน</p>
        <label className="w-full hidden" htmlFor="id">
          id
        </label>
        <input
          readOnly
          required
          className="w-5/6 outline-1 outline-red-400 bg-inherit border-2 border-slate-400 rounded-lg px-3 py-2 hidden"
          value={userID}
          type="text"
          id="id"
          name="id"
        />
        <label className="w-full" htmlFor="name">
          ชื่อ-สกุล
        </label>
        <input
          required
          className="w-5/6 outline-1 outline-red-400 bg-inherit border-2 border-slate-400 rounded-lg px-3 py-2"
          type="text"
          id="name"
          name="name"
          defaultValue={profile.name}
        />
        <label className="w-full mt-3" htmlFor="mobileno">
          หมายเลขโทรศัพท์
        </label>
        <input
          required
          className="w-5/6 outline-1 outline-red-400 bg-inherit border-2 border-slate-400 rounded-lg px-3 py-2"
          type="text"
          id="mobileno"
          name="mobileno"
          defaultValue={profile.mobileno}
        />
        <span className="w-5/6 mb-6 text-xs text-red-700">{invalidMsg}</span>

        <button
          type="submit"
          className=" fixed right-3 bottom-5 ring-2 hover:ring-offset-2 rounded-full ring-slate-400 text-slate-400 p-3"
        >
          <SendIcon />
        </button>
      </form>
      <button
        onClick={() => handleCloseWindow()}
        className="fixed right-3 bottom-[152px] ring-2 hover:ring-offset-2 rounded-full ring-slate-400 text-slate-400 p-3"
      >
        <WebAssetOffIcon />
      </button>
    </div>
  );
}
