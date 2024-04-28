"use server";

import { sendMessageToMaintenance, sendTextMsgToReporter } from "@/lib/line-api";
import clientPromise from "@/lib/mongodb";
import { RequestData } from "@/type/vine-be-gone-now";
import { redirect } from "next/navigation";

export async function findUser(sub: string) {
  try {
    const mongoClient = await clientPromise;
    await mongoClient.connect();
    const userInVine = await mongoClient
      .db("vine-be-gone")
      .collection("user")
      .findOne({ sub });
    if (userInVine) {
      return {
        status: "success",
        hasUserProfile: true,
      };
    }
    const user = await mongoClient
      .db("user")
      .collection("user")
      .findOne(
        {
          sub,
        },
        {
          projection: {
            _id: 0,
            mobileno: 1,
            firstname: 1,
            lastname: 1,
          },
        },
      );
    console.log(user);
    if (!user) {
      return {
        status: "success",
        hasUserProfile: false,
      };
    }
    const resultInsert = await mongoClient
      .db("vine-be-gone")
      .collection("user")
      .insertOne({
        sub,
        mobileno: user["mobileno"],
        name: `${user["firstname"]} ${user["lastname"]}`,
      });
    await mongoClient.close();
    if (!resultInsert.acknowledged) {
      return {
        status: "success",
        hasUserProfile: false,
      };
    }
    return {
      status: "success",
      hasUserProfile: true,
    };
  } catch (e) {
    return {
      status: "fail",
      hasUserProfile: false,
    };
  }
}

export async function saveRiskPoint(data: RequestData, sub: string) {
  const mongoClient = await clientPromise;
  await mongoClient.connect();
  const userInVine = await mongoClient
    .db("vine-be-gone")
    .collection("user")
    .findOne({ sub });
  if (!userInVine) {
    return {
      status: "no user",
    };
  }
  const resultInsert = await mongoClient
    .db("vine-be-gone")
    .collection("risk")
    .insertOne({
      sub,
      riskPoint: data.riskPoint,
      place: data.place,
      lat: data.lat,
      lon: data.lon,
      karnfaifa: data.karnfaifa,
      uploadedImage: data.uploadedImage,
    });
  if (!resultInsert.acknowledged) {
    return {
      status: "cannot insert the riskpoint",
    };
  }

  const sendtToMaintenance = await sendMessageToMaintenance(data,resultInsert.insertedId.toHexString(),userInVine['mobileno'])

  const sendLineMsgStatus = await sendTextMsgToReporter(
    sub,
    `ขอบคุณที่ช่วยรายงานสิ่งผิดปกติให้กับเรา ${sendtToMaintenance?`เราได้ดำเนินการแจ้ง ${data.karnfaifa?.fullName} แล้ว`:`เราจะดำเนินการแจ้ง ${data.karnfaifa?.fullName} ในทันที`} และหากเราดำเนินการแก้ไขจะแจ้งให้ท่านทราบอีกครั้ง`,
  );
  if (!sendLineMsgStatus) {
    return {
      status: "cannot send line msg",
    };
  }
  return {
    status: "success",
  };
}
