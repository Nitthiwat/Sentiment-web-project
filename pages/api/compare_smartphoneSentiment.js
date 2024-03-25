
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
    try {
        let { smartphone } = req.query;
        // smartphone = "iPhone 14";

        if (!smartphone) {
            return res.status(400).json({ message: "Smartphone parameter is required" });
        }

        const client = await clientPromise;
        const db = client.db("deployData");

        // Projection to fetch only necessary fields
        const projection = {
            _id: 0,
            keyword_search: 1,
            Sentiment_Label: 1,
            Aspects: 1
        };

        const cursor = db.collection("SmartphoneReview").find(
            {
                is_sentiment_comment: true,
                keyword_search: smartphone
            },
            { projection }
        );

        // Initialize an object to store formatted data
        const formattedData = {};

        // Iterate through the cursor asynchronously
        await cursor.forEach(async (item) => {
            const smartphoneName = item.keyword_search;

            // Initialize counts for the smartphone if not already present
            if (!formattedData[smartphoneName]) {
                formattedData[smartphoneName] = {
                    OverallSentiment: { count_pos: 0, count_neu: 0, count_neg: 0 },
                    Aspect: {}
                };
            }

            // Increment sentiment count for the smartphone
            switch (item.Sentiment_Label) {
                case "pos":
                    formattedData[smartphoneName].OverallSentiment.count_pos++;
                    break;
                case "neu":
                    formattedData[smartphoneName].OverallSentiment.count_neu++;
                    break;
                case "neg":
                    formattedData[smartphoneName].OverallSentiment.count_neg++;
                    break;
                default:
                    break;
            }

            // Process aspects if available
            if (item.Aspects && Array.isArray(item.Aspects)) {
                item.Aspects.forEach(aspectItem => {
                    const aspectName = aspectItem.aspects;

                    // Initialize counts for the aspect if not already present
                    if (!formattedData[smartphoneName].Aspect[aspectName]) {
                        formattedData[smartphoneName].Aspect[aspectName] = { count_pos: 0, count_neu: 0, count_neg: 0 };
                    }

                    // Increment sentiment count for the aspect
                    switch (aspectItem.Aspect_Sentiment_Label) {
                        case "pos":
                            formattedData[smartphoneName].Aspect[aspectName].count_pos++;
                            break;
                        case "neu":
                            formattedData[smartphoneName].Aspect[aspectName].count_neu++;
                            break;
                        case "neg":
                            formattedData[smartphoneName].Aspect[aspectName].count_neg++;
                            break;
                        default:
                            break;
                    }
                });
            }
        });

        // Send the formatted data in the response
        res.status(200).json(formattedData);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.toString() });
    }
}
