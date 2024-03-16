import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
    try {
        let { brandName, smartphone } = req.query;
        // brandName = "Apple";
        // smartphone = "iPhone 14";

        const client = await clientPromise;
        const db = client.db("deployData");
        if (smartphone) {
            const specData = await db.collection("Specs").find({
                model: smartphone,
                // brand: brandName
            }).toArray();
            if (!specData || specData.length === 0) {
                return res.status(404).json({ message: "Specs not found for the provided smartphone model" });
            }
            res.status(200).json(specData);
        } else if (brandName) {
            const keywordSearchList = await db.collection("Specs").find({
                brand: brandName
            }).toArray();
            const models = keywordSearchList.map(item => item.model);
            res.status(200).json(models);
        } else {
            return res.status(400).json({ message: "BrandName or Smartphone parameter is required" });
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
