// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("deployData");
  switch (req.method) {
    // case "POST":
    //   let bodyObject = JSON.parse(req.body);
    //   let myPost = await db.collection("posts").insertOne(bodyObject);
    //   res.json(myPost.ops[0]);
    //   break;
    case "GET":
      const count_all = await db.collection("SmartphoneReview").countDocuments({is_sentiment_comment:true});
      const count_pos = await db.collection("SmartphoneReview").countDocuments({ is_sentiment_comment:true,Sentiment_Label: { $eq: "pos" } });
      const count_neu = await db.collection("SmartphoneReview").countDocuments({ is_sentiment_comment:true,Sentiment_Label: { $eq: "neu" } });
      const count_neg = await db.collection("SmartphoneReview").countDocuments({ is_sentiment_comment:true,Sentiment_Label: { $eq: "neg" } });
      const count_apple_pos = await db.collection("SmartphoneReview").countDocuments({ is_sentiment_comment:true,Sentiment_Label: { $eq: "pos" },Brand:{$eq:"Apple"}});
      const count_apple_neu = await db.collection("SmartphoneReview").countDocuments({ is_sentiment_comment:true,Sentiment_Label: { $eq: "neu" },Brand:{$eq:"Apple"}});
      const count_apple_neg = await db.collection("SmartphoneReview").countDocuments({ is_sentiment_comment:true,Sentiment_Label: { $eq: "neg" },Brand:{$eq:"Apple"}});
      const count_oppo_pos = await db.collection("SmartphoneReview").countDocuments({ is_sentiment_comment:true,Sentiment_Label: { $eq: "pos" },Brand:{$eq:"OPPO"}});
      const count_oppo_neu = await db.collection("SmartphoneReview").countDocuments({ is_sentiment_comment:true,Sentiment_Label: { $eq: "neu" },Brand:{$eq:"OPPO"}});
      const count_oppo_neg = await db.collection("SmartphoneReview").countDocuments({ is_sentiment_comment:true,Sentiment_Label: { $eq: "neg" },Brand:{$eq:"OPPO"}});
      const count_samsung_pos = await db.collection("SmartphoneReview").countDocuments({ is_sentiment_comment:true,Sentiment_Label: { $eq: "pos" },Brand:{$eq:"Samsung"}});
      const count_samsung_neu = await db.collection("SmartphoneReview").countDocuments({ is_sentiment_comment:true,Sentiment_Label: { $eq: "neu" },Brand:{$eq:"Samsung"}});
      const count_samsung_neg = await db.collection("SmartphoneReview").countDocuments({ is_sentiment_comment:true,Sentiment_Label: { $eq: "neg" },Brand:{$eq:"Samsung"}});
      const count_vivo_pos = await db.collection("SmartphoneReview").countDocuments({ is_sentiment_comment:true,Sentiment_Label: { $eq: "pos" },Brand:{$eq:"vivo"}});
      const count_vivo_neu = await db.collection("SmartphoneReview").countDocuments({ is_sentiment_comment:true,Sentiment_Label: { $eq: "neu" },Brand:{$eq:"vivo"}});
      const count_vivo_neg = await db.collection("SmartphoneReview").countDocuments({ is_sentiment_comment:true,Sentiment_Label: { $eq: "neg" },Brand:{$eq:"vivo"}});
      const count_xiaomi_pos = await db.collection("SmartphoneReview").countDocuments({ is_sentiment_comment:true,Sentiment_Label: { $eq: "pos" },Brand:{$eq:"Xiaomi"}});
      const count_xiaomi_neu = await db.collection("SmartphoneReview").countDocuments({ is_sentiment_comment:true,Sentiment_Label: { $eq: "neu" },Brand:{$eq:"Xiaomi"}});
      const count_xiaomi_neg = await db.collection("SmartphoneReview").countDocuments({ is_sentiment_comment:true,Sentiment_Label: { $eq: "neg" },Brand:{$eq:"Xiaomi"}});
      const count_huawei_pos = await db.collection("SmartphoneReview").countDocuments({ is_sentiment_comment:true,Sentiment_Label: { $eq: "pos" },Brand:{$eq:"Huawei"}});
      const count_huawei_neu = await db.collection("SmartphoneReview").countDocuments({ is_sentiment_comment:true,Sentiment_Label: { $eq: "neu" },Brand:{$eq:"Huawei"}});
      const count_huawei_neg = await db.collection("SmartphoneReview").countDocuments({ is_sentiment_comment:true,Sentiment_Label: { $eq: "neg" },Brand:{$eq:"Huawei"}});
      // aspect
      const countover_apple_pos = await db.collection("SmartphoneReview").countDocuments({ is_sentiment_comment:true,Sentiment_Label: { $eq: "neg" },Brand:{$eq:"Huawei"}});

      await res.json(
        {
          overviews:
          {
            count_all: count_all ?? 0,
            count_pos: count_pos ?? 0,
            count_neu: count_neu ?? 0,
            count_neg: count_neg ?? 0
          },
          brands:
          {
            Apple:
            {
              count_pos: count_apple_pos ?? 0,
              count_neu: count_apple_neu ?? 0,
              count_neg: count_apple_neg ?? 0
            },
            OPPO:
            {
              count_pos: count_oppo_pos ?? 0,
              count_neu: count_oppo_neu ?? 0,
              count_neg: count_oppo_neg ?? 0
            },
            Samsung:
            {
              count_pos: count_samsung_pos ?? 0,
              count_neu: count_samsung_neu ?? 0,
              count_neg: count_samsung_neg ?? 0
            },
            vivo:
            {
              count_pos: count_vivo_pos ?? 0,
              count_neu: count_vivo_neu ?? 0,
              count_neg: count_vivo_neg ?? 0
            },
            Xiaomi:
            {
              count_pos: count_xiaomi_pos ?? 0,
              count_neu: count_xiaomi_neu ?? 0,
              count_neg: count_xiaomi_neg ?? 0
            },
            Huawei:
            {
              count_pos: count_huawei_pos ?? 0,
              count_neu: count_huawei_neu ?? 0,
              count_neg: count_huawei_neg ?? 0
            }
          },
          Aspect:{
            Apple:{
              Overview:{
                pos: countover_apple_pos ?? 0
              }
            }
            
          }

        }
      )
      break;
  }
}


// {
//   overviews: {
//     all:0,
//     pos:0,
//     neg:0,
//     neu:0
//   },
//   brands: {
//     iphone: {
//       pos:0,
//       neg
//     }
//   },
//     Asp : {
//       Apple: {
//         Overview: {
//           pos:0,
//           neu:0,
//           neg:0
//         },
//         Asp: {
//           Camera: {
//             pos,
//             neu,
//             neg
//           }
//           Battery: {
//             pos,
//             neu,
//             neg
//           }
//           Price: {
//             pos,
//             neu,
//             neg
//           }
//           Perfomance: {
//             pos,
//             neu,
//             neg
//           }
//         },
//         Comment: [
//           ....
//         ]
        
//       }
//     }
// }
