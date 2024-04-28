import { RequestData } from "@/type/vine-be-gone-now";
import clientPromise from "./mongodb";

export async function sendTextMsgToReporter(sub: string, msg: string) {
  const res = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_MESSAGING_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: sub,
      messages: [
        {
          type: "text",
          text: msg,
        },
      ],
    }),
  });
  return res.status==200
}

export async function sendMessageToMaintenance(data: RequestData, id: string,tel: string) {
  const mongoClient = await clientPromise;
  await mongoClient.connect();
  const aojColl = mongoClient.db("vine-be-gone").collection("aoj");
  const groupId = (await aojColl.findOne({businessName: data.karnfaifa?.businessName}))
  if(!groupId || groupId['lineGroup']==""){
    return false
  }

  const lineApiUrl = "https://api.line.me/v2/bot/message/push";
  const accessToken = process.env.NEXT_PUBLIC_MESSAGING_TOKEN as string;

  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  const body = {
    to: groupId['lineGroup']?groupId['lineGroup']:"",
    messages: [
      {
        type: "template",
        altText: "มีผู้รายงานจุดเสี่ยงในระบบไฟฟ้า",
        template: {
          type: "buttons",
          thumbnailImageUrl: data.uploadedImage?.url,
          imageAspectRatio: "square",
          imageSize: "contain",
          imageBackgroundColor: "#F3E6E6",
          title: "ได้รับแจ้งสิ่งผิดปกติในระบบไฟฟ้า",
          text: `สิ่งผิดปกติ: ${data.riskPoint}\nหมายเลขเสา/สถานที่: ${data.place}`,
          actions: [
            {
              type: "uri",
              label: "โทรหาผู้แจ้ง",
              uri: `tel:${tel}`,
            },
            {
              type: "uri",
              label: "แผนที่",
              uri: `https://www.google.com/maps?q=${data.lat},${data.lon}`,
            },
            {
              type: "uri",
              label: "แก้ไข",
              uri: `${process.env.NEXT_PUBLIC_MAINTENACE_URL}/maintenance/pm-vine/${id}`,
            },
          ],
        },
      },
    ],
  };

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  };

  const resLineApi = await fetch(lineApiUrl, requestOptions);
  return resLineApi.status == 200
}
