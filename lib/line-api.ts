export async function sendTextMsgToReporter(sub:string,msg:string){
    const res = await fetch("https://api.line.me/v2/bot/message/push",{
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_MESSAGING_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            to: sub,
            messages:[
                {
                    type: "text",
                    text: msg
                }
            ]
        })
    })
    console.log(res.status)
    return res.status
}