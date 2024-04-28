// pages/api/findAOJ.ts

export async function POST(req: Request) {
  const reqObj = (await req.json())[0];
  console.log(reqObj)
  const message = reqObj.message.text as string;
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
          text: `ตอบกลับ ${message}`,
        },
      ],
    }),
  });

  return new Response("", {
    status: resLineApi.status,
  });
}
