"use server";

import clientPromise from "@/lib/mongodb";

export async function addProfile(prevState: any, formData: FormData) {
  try {
    const mongoClient = await clientPromise;
    const sub = formData.get("id");
    if (!sub) {
      return {
        message: "error",
      };
    }
    const mobileno = (formData.get("mobileno") as string).replace(/-/g, "");
    if (!/^0[6-9]\d{8}$/.test(mobileno as string)) {
      return {
        message: "invalid, *กรุณากรอกหมายเลขโทรศัพท์มือถือ 10 หลักให้ถูกต้อง",
      };
    }
    const findProfile = await getProfile(sub as string);
    if (findProfile["name"] == "" && findProfile["mobileno"] == "") {
      await mongoClient.connect();
      const resultInsert = await mongoClient
        .db("vine-be-gone")
        .collection("user")
        .insertOne({
          sub,
          mobileno,
          name: formData.get("name"),
        });
      await mongoClient.close();
      if (!resultInsert.acknowledged) {
        return {
          message: "error",
        };
      }
    } else {
      console.log("update");
      await mongoClient.connect();
      const resultInsert = await mongoClient
        .db("vine-be-gone")
        .collection("user")
        .updateOne(
          { sub: formData.get("id") },
          {
            $set: {
              sub: formData.get("id"),
              mobileno,
              name: formData.get("name"),
            },
          },
        );
      await mongoClient.close();
      if (!resultInsert.acknowledged) {
        return {
          message: "error",
        };
      }
    }

    return {
      message: "/",
    };
  } catch (e) {
    console.log(e);
    return {
      message: "error",
    };
  }
}

export async function getProfile(sub: string) {
  try {
    const mongoClient = await clientPromise;
    await mongoClient.connect();
    const doc = await mongoClient
      .db("vine-be-gone")
      .collection("user")
      .findOne(
        {
          sub,
        },
        {
          projection: {
            _id: 0,
            name: 1,
            mobileno: 1,
          },
        },
      );
    await mongoClient.close();
    if (!doc) {
      return {
        mobileno: "",
        name: "",
      };
    }
    return {
      mobileno: doc["mobileno"],
      name: doc["name"],
    };
  } catch (e) {
    return {
      mobileno: "",
      name: "",
    };
  }
}
