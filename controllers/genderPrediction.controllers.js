import getNameNationality from "../utilis/nationalize.js";
import getNameAge from "../utilis/agify.js";
import getGenderPrediction from "../utilis/genderizer.js";
import Profile from "../models/profile.models.js";


export const createProfile =async (req, res, next) => {
	try {
		const { name } = req.body;

		console.log("Received name:", name);
		if (!name) {
			const error = new Error("Missing or empty name parameter");
			error.statusCode = 400;
			throw error;
		}

		if (typeof name !== "string") {
			const error = new Error("Name is not a string");
			error.statusCode = 422;
			throw error;
		}

		const checkExistingProfile = await Profile.findOne({ name: name.trim() });


		if (checkExistingProfile) {
			return res.status(200).json({
				status: "success",
				message: "Profile already exists",
				data: checkExistingProfile
			});
		}

		const genderPredicted = await getGenderPrediction(name);
		const nationalityPredicted = await getNameNationality(name);
		const agePredicted = await getNameAge(name);

		const newProfile = await Profile.create({
			name: name.trim(),
			gender: genderPredicted.gender,
			gender_probability: genderPredicted.probability,
			sample_size: genderPredicted.count,
			age: agePredicted.age,
			age_group: agePredicted.ageGroup,
			country_id: nationalityPredicted.countryId,
			country_probability: nationalityPredicted.probability
		});

		res.status(201).json({
			status: "success",
			message: "Profile created successfully",
			data: newProfile
		});
	} catch (error) {
		next(error);
	}
};

export const getAllProfiles = async (req, res, next) => {
	try {
		const profiles = await Profile.find();

		return res.status(200).json({
			status: "success",
			count: profiles.length,
			message: "Profiles retrieved successfully",
			data: profiles
		});

	} catch (error) {
		next(error);
	}
};

export const getSingleProfile = async (req, res, next) => {
	try {
		const { id } = req.params;

		const profile = await Profile.findOne({ publicId: id });

		if (!profile) {
			const error = new Error("User profile not found");
			error.statusCode = 404;
			throw error;
		}

		return res.status(200).json({
			status: "success",
			message: "Profile retrieved successfully",
			data: profile
		});
	} catch (error) {
		next(error);
	}
};

export const deleteProfile = async (req, res, next) => {
	try {
		const { id } = req.params;

		const profile = await Profile.findOneAndDelete({ publicId: id });

		if (!profile) {
			const error = new Error("User profile not found");
			error.statusCode = 404;
			throw error;
		}

		return res.status(200).json({
			status: "success",
			message: "Profile deleted successfully",
			data: profile
		});
	} catch (error) {
		next(error);
	}
};
