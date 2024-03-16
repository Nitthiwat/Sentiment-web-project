// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("deployData");
  switch (req.method) {

    case "GET":
      const brand = req.query.brand ?? "Apple"
      const model = req.query.model ?? "iPhone 12"

      console.log("Test API brand => ", brand)
      console.log("Test API model => ", model + "|")

      const model_pos = await db.collection('SmartphoneReview').countDocuments({ is_sentiment_comment: true, Sentiment_Label: { $eq: "pos" }, Brand: { $eq: brand }, keyword_search: { $eq: model } });
      const model_neu = await db.collection('SmartphoneReview').countDocuments({ is_sentiment_comment: true, Sentiment_Label: { $eq: "neu" }, Brand: { $eq: brand }, keyword_search: { $eq: model } });
      const model_neg = await db.collection('SmartphoneReview').countDocuments({ is_sentiment_comment: true, Sentiment_Label: { $eq: "neg" }, Brand: { $eq: brand }, keyword_search: { $eq: model } });
      const camera_pos = await db.collection('SmartphoneReview').countDocuments({
        is_sentiment_comment: true, Brand: { $eq: brand }, keyword_search: { $eq: model },
        "Aspects.aspects": "Camera", "Aspects.Aspect_Sentiment_Label": "pos"
      });
      const camera_neu = await db.collection('SmartphoneReview').countDocuments({
        is_sentiment_comment: true, Brand: { $eq: brand }, keyword_search: { $eq: model },
        "Aspects.aspects": "Camera", "Aspects.Aspect_Sentiment_Label": "neu"
      });
      const camera_neg = await db.collection('SmartphoneReview').countDocuments({
        is_sentiment_comment: true, Brand: { $eq: brand }, keyword_search: { $eq: model },  
        "Aspects.aspects": "Camera", "Aspects.Aspect_Sentiment_Label": "neg"
      });
      const battery_pos = await db.collection('SmartphoneReview').countDocuments({
        is_sentiment_comment: true, Brand: { $eq: brand }, keyword_search: { $eq: model },
        "Aspects.aspects": "Battery", "Aspects.Aspect_Sentiment_Label": "pos"
      });
      const battery_neu = await db.collection('SmartphoneReview').countDocuments({
        is_sentiment_comment: true, Brand: { $eq: brand }, keyword_search: { $eq: model },
        "Aspects.aspects": "Battery", "Aspects.Aspect_Sentiment_Label": "neu"
      });
      const battery_neg = await db.collection('SmartphoneReview').countDocuments({
        is_sentiment_comment: true, Brand: { $eq: brand }, keyword_search: { $eq: model },
        "Aspects.aspects": "Battery", "Aspects.Aspect_Sentiment_Label": "neg"
      });
      const screen_pos = await db.collection('SmartphoneReview').countDocuments({
        is_sentiment_comment: true, Brand: { $eq: brand }, keyword_search: { $eq: model },
        "Aspects.aspects": "Screen", "Aspects.Aspect_Sentiment_Label": "pos"
      });
      const screen_neu = await db.collection('SmartphoneReview').countDocuments({
        is_sentiment_comment: true, Brand: { $eq: brand }, keyword_search: { $eq: model },
        "Aspects.aspects": "Screen", "Aspects.Aspect_Sentiment_Label": "neu"
      });
      const screen_neg = await db.collection('SmartphoneReview').countDocuments({
        is_sentiment_comment: true, Brand: { $eq: brand }, keyword_search: { $eq: model },
        "Aspects.aspects": "Screen", "Aspects.Aspect_Sentiment_Label": "neg"
      });
      const performance_pos = await db.collection('SmartphoneReview').countDocuments({
        is_sentiment_comment: true, Brand: { $eq: brand }, keyword_search: { $eq: model },
        "Aspects.aspects": "Performance", "Aspects.Aspect_Sentiment_Label": "pos"
      });
      const performance_neu = await db.collection('SmartphoneReview').countDocuments({
        is_sentiment_comment: true, Brand: { $eq: brand }, keyword_search: { $eq: model },
        "Aspects.aspects": "Performance", "Aspects.Aspect_Sentiment_Label": "neu"
      });
      const performance_neg = await db.collection('SmartphoneReview').countDocuments({
        is_sentiment_comment: true, Brand: { $eq: brand }, keyword_search: { $eq: model },
        "Aspects.aspects": "Performance", "Aspects.Aspect_Sentiment_Label": "neg"
      });
      const price_pos = await db.collection('SmartphoneReview').countDocuments({
        is_sentiment_comment: true, Brand: { $eq: brand }, keyword_search: { $eq: model },
        "Aspects.aspects": "Price", "Aspects.Aspect_Sentiment_Label": "pos"
      });
      const price_neu = await db.collection('SmartphoneReview').countDocuments({
        is_sentiment_comment: true, Brand: { $eq: brand }, keyword_search: { $eq: model },
        "Aspects.aspects": "Price", "Aspects.Aspect_Sentiment_Label": "neu"
      });
      const price_neg = await db.collection('SmartphoneReview').countDocuments({
        is_sentiment_comment: true, Brand: { $eq: brand }, keyword_search: { $eq: model },
        "Aspects.aspects": "Price", "Aspects.Aspect_Sentiment_Label": "neg"
      });
      const reviews_pos = await db.collection('SmartphoneReview').aggregate([
        { $match: { is_sentiment_comment: true, Sentiment_Label: { $eq: "pos" }, Brand: brand, keyword_search: model } },
        { $group: { _id: null, reviews_pos: { $addToSet: "$textDisplay" } } },
        { $project: { _id: 0, reviews_pos: 1 } }
      ]).toArray();
      const reviews_neu = await db.collection('SmartphoneReview').aggregate([
        { $match: { is_sentiment_comment: true, Sentiment_Label: { $eq: "neu" }, Brand: brand, keyword_search: model } },
        { $group: { _id: null, reviews_neu: { $addToSet: "$textDisplay" } } },
        { $project: { _id: 0, reviews_neu: 1 } }
      ]).toArray();
      const reviews_neg = await db.collection('SmartphoneReview').aggregate([
        { $match: { is_sentiment_comment: true, Sentiment_Label: { $eq: "neg" }, Brand: brand, keyword_search: model } },
        { $group: { _id: null, reviews_neg: { $addToSet: "$textDisplay" } } },
        { $project: { _id: 0, reviews_neg: 1 } }
      ]).toArray();
      const word_pos = await db.collection('SmartphoneReview').aggregate([
        { $match: { is_sentiment_comment: true, Sentiment_Label: { $eq: "pos" }, Brand: brand, keyword_search: model } },
        { $group: { _id: null, reviews_pos: { $addToSet: "$processed" } } },
        { $project: { _id: 0, reviews_pos: 1 } }
      ]).toArray();
      const word_neu = await db.collection('SmartphoneReview').aggregate([
        { $match: { is_sentiment_comment: true, Sentiment_Label: { $eq: "neu" }, Brand: brand, keyword_search: model } },
        { $group: { _id: null, reviews_neu: { $addToSet: "$processed" } } },
        { $project: { _id: 0, reviews_neu: 1 } }
      ]).toArray();
      const word_neg = await db.collection('SmartphoneReview').aggregate([
        { $match: { is_sentiment_comment: true, Sentiment_Label: { $eq: "neg" }, Brand: brand, keyword_search: model } },
        { $group: { _id: null, reviews_neg: { $addToSet: "$processed" } } },
        { $project: { _id: 0, reviews_neg: 1 } }
      ]).toArray();


      await res.json({
        overviews: {
          model_pos: model_pos ?? 0,
          model_neu: model_neu ?? 0,
          model_neg: model_neg ?? 0
        },
        Aspect: {
          Camera: {
            aspect_pos: camera_pos ?? 0,
            aspect_neu: camera_neu ?? 0,
            aspect_neg: camera_neg ?? 0
          },
          Battery: {
            aspect_pos: battery_pos ?? 0,
            aspect_neu: battery_neu ?? 0,
            aspect_neg: battery_neg ?? 0
          },
          Screen: {
            aspect_pos: screen_pos ?? 0,
            aspect_neu: screen_neu ?? 0,
            aspect_neg: screen_neg ?? 0,
          },
          Performance: {
            aspect_pos: performance_pos ?? 0,
            aspect_neu: performance_neu ?? 0,
            aspect_neg: performance_neg ?? 0,
          },
          Price: {
            aspect_pos: price_pos ?? 0,
            aspect_neu: price_neu ?? 0,
            aspect_neg: price_neg ?? 0
          }
        },
        Review: {
          reviews_pos,
          reviews_neu,
          reviews_neg
        },
        WordCloud: {
          word_pos,
          word_neu,
          word_neg
        }
      });
      break;
    default:
      res.status(405).end();
  }
}

