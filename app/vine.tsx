"use client"

import { useState, useEffect, useMemo } from "react";
import { useLiff } from "react-liff";

// const liffId = process.env.NEXTAUTH_LINE_ID as string

export default function VineBeGoneNow(){
  const [displayName,setDisplayname] = useState("")

  useEffect(() => {
    const initialLiff = async()=>{
      const liff = (await import('@line/liff')).default
        try {
          await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID as string });
        } catch (error) {
          console.error('liff init error')
        }
        if (!liff.isLoggedIn()) {
          liff.login();
        }
        else{
          setDisplayname((await (liff.getProfile())).displayName)
        }
    }
    initialLiff()
  })


  
    return (
      <>
        <p>Welcome to the react-liff demo app, {displayName}!</p>
      </>
    );
};
