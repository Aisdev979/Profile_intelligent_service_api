import getNameNationality from "../utilis/nationalize.js";
import getNameAge from "../utilis/agify.js";
import getGenderPrediction from "../utilis/genderizer.js";
import Profile from "../models/profile.models.js";


export const createProfile = async (req, res, next) => {
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
			status: 'success',
			message: 'Profile already exists',
			data: {
				id: checkExistingProfile.id,
				name: checkExistingProfile.name,
				gender: checkExistingProfile.gender,
				gender_probability: checkExistingProfile.gender_probability,
				sample_size: checkExistingProfile.sample_size,
				age: checkExistingProfile.age,
				age_group: checkExistingProfile.age_group,
				country_id: checkExistingProfile.country_id,
				country_probability: checkExistingProfile.country_probability,
				created_at: checkExistingProfile.createdAt
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
			status: 'success',
			data: {
				id: newProfile.id,
				name: newProfile.name,
				gender: newProfile.gender,
				gender_probability: newProfile.gender_probability,
				sample_size: newProfile.sample_size,
				age: newProfile.age,
				age_group: newProfile.age_group,
				country_id: newProfile.country_id,
				country_probability: newProfile.country_probability,
				created_at: newProfile.createdAt
							            } });
	} catch (error) {
		next(error);
	}
};

export const getAllProfiles = async (req, res, next) => {
	try {
		const { gender, country_id, age_group } = req.query;

		const queryFilter = {};

		if (gender) {
			queryFilter.gender = { $regex: new RegExp(`^${gender}$`, 'i') };
		}
		if (country_id) {
			queryFilter.country_id = { $regex: new RegExp(`^${country_id}$`, 'i') };
		}
		if (age_group) {
			queryFilter.age_group = { $regex: new RegExp(`^${age_group}$`, 'i') };
		}

		const profiles = await Profile.find(queryfilter).sort({ created_at: -1 });

		const cleanProfilesData = profiles.map(cleanProfile => ({
			id: cleanProfile.id,
			name: cleanProfile.name,
			gender: cleanProfile.gender,
			age: cleanProfile.age,
			age_group: cleanProfile.age_group,
			country_id: cleanProfile.country_id,
			created_at: cleanProfile.createdAt
		}));

		        res.status(200).json({
				status: 'success',
				count: cleanProfilesData.length,
				data: cleanProfilesData
			});

	} catch (error) {
		next(error);
	}
};

export const getSingleProfile = async (req, res, next) => {
	try {
		const { id } = req.params;

		const profile = await Profile.findOne({id: id});

		if (!profile) {
			const error = new Error("User profile not found");
			error.statusCode = 404;
			throw error;
		}

		return res.status(200).json({
			status: "success",
			data: {
				id: profile.id,
				name: profile.name,
				gender: profile.gender,
				gender_probability: profile.gender_probability,
				sample_size: profile.sample_size,
				age: profile.age,
				age_group: profile.age_group,
				country_id: profile.country_id,
				country_probability: profile.country_probability,
				created_at: profile.created_at.toISOString()
			}
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

		res.status(204).send()
	} catch (error) {
		next(error);
	}
};
