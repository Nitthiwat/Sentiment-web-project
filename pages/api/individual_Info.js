import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
    try {
        let { smartphone } = req.query;
        // smartphone = "Huawei nova 11i";

        if (!smartphone) {
            return res.status(400).json({ message: "Smartphone parameter is required" });
        }

        const client = await clientPromise;
        const db = client.db("deployData");

        const projection = {
            _id: 0,
            Sentiment_Label: 1,
            text_Display: 1,
            Aspects: 1
        };

        const keywordSearchList = await db.collection("SmartphoneReview").find({
            is_sentiment_comment: true,
            keyword_search: smartphone
        },
            { projection }
        ).toArray();

        res.status(200).json(keywordSearchList);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.toString() });
    }
}
