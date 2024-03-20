// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import clientPromise from "../../lib/mongodb";

// export default async function handler(req, res) {
//   const client = await clientPromise;
//   const db = client.db("deployData");
//   console.log(req)
//   switch (req.method) {

//     case "GET":

//       const brand = req.query.brand ?? "Apple"
//       const documents = await db.collection('SmartphoneReview').aggregate([
//         {
//           $match: {
//             is_sentiment_comment: true,
//             Brand: brand
//           }
//         },
//         {
//           $group: {
//             _id: null,
//             keyword_search: { $addToSet: "$keyword_search" }
//           }
//         },
//         {
//           $unwind: "$keyword_search" 
//         },
//         {
//           $sort: { "keyword_search": 1 } 
//         },
//         {
//           $group: {
//             _id: null,
//             keyword_search: { $push: "$keyword_search" } 
//           }
//         },
//         {
//           $project: {
//             _id: 0,
//             keyword_search: 1
//           }
//         }
//       ]).toArray()

//       // {
//       //   $match: {
//       //     is_sentiment_comment: true,
//       //     Brand: brand
//       //   }
//       // },
//       // {
//       //   $sort: { "keyword_search": 1 } // เรียงลำดับเอกสารตาม keyword_search แบบอักษร
//       // },
//       // {
//       //   $group: {
//       //     _id:null,
//       //       keyword_search: {$addToSet:"$keyword_search"}
//       //   }
//       // },
//       // {
//       //   $project: {
//       //     _id: 0,
//       //     keyword_search: 1
//       //   }
//       // }


//       // ดึงข้อมูลเฉพาะ Brand และ keyword_search จากเอกสารที่มี is_sentiment_comment เป็น true
//       // const documents = await db.collection("SmartphoneReview").find({
//       //   is_sentiment_comment: true
//       // }, {
//       //   projection: { Brand: 1, keyword_search: 1, _id: 0 }
//       // }).toArray();

//       // // สร้าง object สำหรับเก็บข้อมูลแยกตาม Brand และ keyword_search
//       // let brandData = {};

//       // documents.forEach(doc => {
//       //   let brand = doc.Brand;
//       //   let keyword = doc.keyword_search;

//       //   if (!brandData[brand]) {
//       //     brandData[brand] = new Set(); // ใช้ Set เพื่อหลีกเลี่ยงการเพิ่มข้อมูลซ้ำ
//       //   }
//       //   brandData[brand].add(keyword);
//       // });

//       // // แปลงข้อมูลให้อยู่ในรูปแบบที่ต้องการ
//       // let formattedData = {};
//       // Object.keys(brandData).forEach(brand => {
//       //   formattedData[brand] = Array.from(brandData[brand]);
//       // });

//       // cacheData = formattedData


//       // ส่งข้อมูลกลับไปเป็น response JSON
//       res.json(documents);
//       break;
//     default:
//       res.status(405).end(); // ส่งคืนสถานะ 405 Method Not Allowed หาก method ไม่ใช่ GET
//   }
// }

import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  try {
    let { brandName } = req.query;

    // If brandName is not provided in the query, set it to "Apple" by default
    if (!brandName) {
      brandName = "Apple";
    }

    const client = await clientPromise;
    const db = client.db("deployData");

    const keywordSearchList = await db.collection("Specs").find({
      brand: brandName
    }).toArray();

    const models = keywordSearchList.map(item => item.model);

    res.status(200).json(models);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
