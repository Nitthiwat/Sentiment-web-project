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

        const keywordSearchList = await db.collection("SmartphoneReviewTest").find({
            is_sentiment_comment: true,
            keyword_search: smartphone
        }).toArray();

        const formattedData = {};

        keywordSearchList.forEach(item => {
            const smartphoneName = item.keyword_search;

            if (!formattedData[smartphoneName]) {
                formattedData[smartphoneName] = {
                    OverallSentiment: { count_pos: 0, count_neu: 0, count_neg: 0 },
                    Aspect: {}
                };
            }

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

            if (item.Aspects && Array.isArray(item.Aspects)) {
                item.Aspects.forEach(aspectItem => {
                    const aspectName = aspectItem.aspects;

                    if (!formattedData[smartphoneName].Aspect[aspectName]) {
                        formattedData[smartphoneName].Aspect[aspectName] = { count_pos: 0, count_neu: 0, count_neg: 0 };
                    }

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

        res.status(200).json(formattedData);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.toString() });
    }
}
