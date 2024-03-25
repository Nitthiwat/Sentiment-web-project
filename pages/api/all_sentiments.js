import clientPromise from "../../lib/mongodb";

export const maxDuration = 300;

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db("deployData");

        // Fetch only required fields using projection
        const cursor = db.collection("SmartphoneReview").find(
            { is_sentiment_comment: true },
            { projection: { Brand: 1, Sentiment_Label: 1 } }
        );

        // Initialize an object to store sentiment counts for each brand
        const brandSentiments = {};

        // Iterate through the cursor asynchronously
        await cursor.forEach(async (item) => {
            const brand = item.Brand;
            const sentiment = item.Sentiment_Label;

            // Initialize counts for the brand if not already present
            if (!brandSentiments[brand]) {
                brandSentiments[brand] = {
                    count_pos: 0,
                    count_neu: 0,
                    count_neg: 0
                };
            }

            // Increment sentiment count for the brand
            brandSentiments[brand][`count_${sentiment}`]++;
        });

        // Calculate total sentiment counts
        const totalSentiments = {
            count_all: await cursor.count(), // Count all documents
            count_pos: 0,
            count_neu: 0,
            count_neg: 0
        };

        // Aggregate sentiment counts for all brands
        Object.values(brandSentiments).forEach(sentiments => {
            totalSentiments.count_pos += sentiments.count_pos;
            totalSentiments.count_neu += sentiments.count_neu;
            totalSentiments.count_neg += sentiments.count_neg;
        });

        // Prepare the response object
        const response = {
            overviews: totalSentiments,
            brands: brandSentiments
        };

        // Send the response
        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.toString() });
    }
}
