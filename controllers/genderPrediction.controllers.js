import getGenderPrediction from "../models/genderPrediction.modles.js"


const getPredictedGender =async (req, res, next) => {
	try {
		const { name } = req.query;
		const genderPredicted = await getGenderPrediction(name);

		res.status(200).json({
			status: "success",
			data: {
				name: genderPredicted.name,
				gender: genderPredicted.gender,
				probability: genderPredicted.probability,
				sample_size: genderPredicted.count,
				is_confident:
				genderPredicted.probability >= 0.7 &&
				genderPredicted.count >= 100,
				processed_at: new Date().toISOString()
			}
		});
	} catch (error) {
		next(error);
	}
};

export default getPredictedGender;

