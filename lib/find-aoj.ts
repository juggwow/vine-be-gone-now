import AOJ from "@/lib/AOJ";
import clientPromise from "@/lib/mongodb";

const turf = require("@turf/turf");
const utmObj = require("utm-latlng");

const shapefileData = JSON.parse(AOJ);
const utm = new utmObj();

export async function findAOJ(
    lat: number,
    lon: number,
  ): Promise<
    undefined | null | { businessName: string; fullName: string; aoj: string }
  > {
    const myUTM = utm.convertLatLngToUtm(lat, lon, 1);
  
    const targetPoint = turf.point([myUTM.Easting, myUTM.Northing]);
  
    for (const aojs of shapefileData.features) {
      try {
        if (aojs.geometry.coordinates.length > 1) {
          for (const subAOJS of aojs.geometry.coordinates) {
            const area = turf.polygon(subAOJS);
            const containArea = turf.booleanPointInPolygon(targetPoint, area);
            if (containArea) {
              return await findBusinessFromCode(
                subAOJS.properties.CODE.toString(),
              );
            }
          }
        } else {
          const area = turf.polygon(aojs.geometry.coordinates);
          const containingArea = turf.booleanPointInPolygon(targetPoint, area);
          if (containingArea) {
            return await findBusinessFromCode(aojs.properties.CODE.toString());
          }
        }
      } catch (e) {
        return null;
      }
    }
  
    return null;
  }
  
  export async function findBusinessFromCode(aoj: string) {
    try {
      const mongoClient = await clientPromise;
      await mongoClient.connect();
  
      const result = (await mongoClient
        .db("vine-be-gone")
        .collection("aoj")
        .findOne(
          { aoj },
          {
            projection: {
              _id: 0,
              aoj: 1,
              fullName: 1,
              businessName: 1,
            },
          },
        )) as unknown as {
        businessName: string;
        fullName: string;
        aoj: string;
      } | null;
      return result;
    } catch (e) {
      return null;
    }
  }