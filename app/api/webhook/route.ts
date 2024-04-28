// pages/api/findAOJ.ts

import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  const reqObj = (await req.json()).events[0];
  if(reqObj.type != "message"){
    return new Response("",{
        status: 200
    })
  }
  const message = reqObj.message.text as string;
  if(!message.startsWith("registorGroupID: ")){
    return new Response("",{
        status: 200
    })
  }

  const center = message.split("registorGroupID: ")[1]
  const mongoClient = await clientPromise
  await mongoClient.connect()
  const resultUpdateGroupID = await mongoClient.db("vine_be-gone").collection("aoj").updateMany({
    center
  },{
    $set: {
        lineGroup: reqObj.source.groupId
    }
  })
  await mongoClient.db("vine-be-gone").collection("webhook").insertOne({
    reqObj,
    groupId: reqObj.source.groupId,
    center,
    resultUpdateGroupID
  })
  await mongoClient.close()
  const replyText = resultUpdateGroupID.acknowledged?`ลงทะเบียนกลุ่มนี้เป็นกลุ่มแจ้งเตือนของ ${center}`:"ไม่สามารถลงทะเบียนไลน์กลุ่มนี้เป็นกลุ่มแจ้งเตือนได้"
  const replyToken = reqObj.replyToken;
  const resLineApi = await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_MESSAGING_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      replyToken,
      messages: [
        {
          type: "text",
          text: replyText,
        },
      ],
    }),
  });

  return new Response("", {
    status: resLineApi.status,
  });
}
