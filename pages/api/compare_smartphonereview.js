import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
    try {
        let { smartphone, selectedAspect } = req.query;
        // smartphone = "iPhone 12"; // Assigning a new value to the variable
        // selectedAspect = "Camera";

        if (!smartphone) {
            return res.status(400).json({ message: "Smartphone parameter is required" });
        }

        const client = await clientPromise;
        const db = client.db("deployData");

        const keywordSearchList = await db.collection("SmartphoneReviewTest").find({
            is_sentiment_comment: true,
            keyword_search: smartphone // Filter by the selected smartphone
        }).toArray();

        let formattedData;

        if (selectedAspect) {
            formattedData = keywordSearchList.flatMap(item => {
                if (Array.isArray(item.Aspects)) {
                    return item.Aspects.map(aspect => ({
                        aspects: aspect.aspects,
                        textDisplay_aspect: aspect.textDisplay_aspect,
                        smartphoneName: item.keyword_search,
                        Aspect_Sentiment_Label: aspect.Aspect_Sentiment_Label
                    }));
                } else {
                    return [];
                }
            });
        } else {
            formattedData = keywordSearchList.map(item => ({
                textDisplay: item.textDisplay,
                smartphoneName: item.keyword_search,
                Sentiment_Label: item.Sentiment_Label,
                // processed: item.processed,
                // Aspects: item.Aspects
            }));
        }

        res.status(200).json(formattedData);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}
