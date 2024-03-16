import clientPromise from "../../lib/mongodb";
export default async function handler(req, res) {
  try {
    const model = req.query.model ?? "iPhone 12"

    if (!model) {
      return res.status(400).json({ message: "Smartphone parameter is required" });
    }

    const client = await clientPromise;
    const db = client.db("deployData");

    const keywordSearchList = await db.collection("SmartphoneReview").find({
      is_sentiment_comment: true,
      keyword_search: model 
    }).toArray();

    const formattedData = keywordSearchList.map(item => ({
      textDisplay: item.textDisplay,
      smartphoneName: item.keyword_search,
      Sentiment_Label: item.Sentiment_Label,
      // processed: item.processed,
      Aspects: item.Aspects
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
