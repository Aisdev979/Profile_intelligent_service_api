import getNameNationality from "../utilis/nationalize.js";
import getNameAge from "../utilis/agify.js";
import getGenderPrediction from "../utilis/genderizer.js";
import Profile from "../models/profile.models.js";
import { buildFiltersFromText, buildMongoQueryFromFilters } from "../utilis/nlQueryEngine.js";


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

    const cleanName = name.trim().toLowerCase();

    const checkExistingProfile = await Profile.findOne({ name: cleanName });
    if (checkExistingProfile) {
      return res.status(200).json({
        status: "success",
        message: "Profile already exists",
        data: {
          id: checkExistingProfile.id,
          name: checkExistingProfile.name,
          gender: checkExistingProfile.gender,
          gender_probability: checkExistingProfile.gender_probability,
          age: checkExistingProfile.age,
          age_group: checkExistingProfile.age_group,
          country_id: checkExistingProfile.country_id,
          country_probability: checkExistingProfile.country_probability,
          created_at: checkExistingProfile.createdAt
        }
      });
    }

    const genderPredicted = await getGenderPrediction(cleanName);
    const nationalityPredicted = await getNameNationality(cleanName);
    const agePredicted = await getNameAge(cleanName);

    const newProfile = await Profile.create({
      name: cleanName,
      gender: genderPredicted.gender,
      gender_probability: genderPredicted.probability,
      age: agePredicted.age,
      age_group: agePredicted.ageGroup,
      country_id: nationalityPredicted.countryId,
      country_probability: nationalityPredicted.probability
    });

    res.status(201).json({
      status: "success",
      data: {
        id: newProfile.id,
        name: newProfile.name,
        gender: newProfile.gender,
        gender_probability: newProfile.gender_probability,
        age: newProfile.age,
        age_group: newProfile.age_group,
        country_id: newProfile.country_id,
        country_probability: newProfile.country_probability,
        created_at: newProfile.createdAt
      }
    });

  } catch (error) {
    next(error);
  }
};

export const getAllProfiles = async (req, res, next) => {
  try {
    if (!req.query) {
      const error = new Error("Invalid query parameters");
      error.statusCode = 422;
      throw error;
    }

    const {
      gender,
      age_group,
      country_id,
      min_age,
      max_age,
      min_gender_probability,
      min_country_probability,
      sort_by = "created_at",
      order = "asc",
      page = 1,
      limit = 10,
    } = req.query;

    /**
     * Build MongoDB filter object
     */
    const query = {};

    if (gender) query.gender = gender;
    if (age_group) query.age_group = age_group;
    if (country_id) query.country_id = country_id;

    if (min_age || max_age) {
      query.age = {};
      if (min_age) query.age.$gte = Number(min_age);
      if (max_age) query.age.$lte = Number(max_age);
    }

    if (min_gender_probability) {
      query.gender_probability = { $gte: Number(min_gender_probability) };
    }

    if (min_country_probability) {
      query.country_probability = { $gte: Number(min_country_probability) };
    }

    /**
     * Pagination setup
     */
    const skip = (Number(page) - 1) * Number(limit);

    /**
     * Sorting setup
     */
    const sort = {
      [sort_by]: order === "desc" ? -1 : 1,
    };

    /**
     * Execute query
     */
    const data = await Profile.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    /**
     * Get total count for pagination
     */
    const total = await Profile.countDocuments(query);

    return res.json({
      status: "success",
      page: Number(page),
      limit: Number(limit),
      total,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const searchNaturalLanguage = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q) {
      const error = new Error("Query parameter 'q' is required");
      error.statusCode = 400;
      throw error;
    }

    // Convert text → filters
    const parsed = buildFiltersFromText(q);

    if (!parsed) {
      const error = new Error("Unable to interpret query");
      error.statusCode = 422;
      throw error;
    }

    // Build Mongo query
    const mongoQuery = buildMongoQueryFromFilters(parsed);

    // Pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const [data, total] = await Promise.all([
      Profile.find(mongoQuery).skip(skip).limit(limitNum),
      Profile.countDocuments(mongoQuery),
    ]);

    return res.json({
      status: "success",
      page: pageNum,
      limit: limitNum,
      total,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getSingleProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const profile = await Profile.findOne({ id });

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
        age: profile.age,
        age_group: profile.age_group,
        country_id: profile.country_id,
        country_probability: profile.country_probability,
        created_at: profile.createdAt
      }
    });

  } catch (error) {
    next(error);
  }
};


export const deleteProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const profile = await Profile.findOneAndDelete({ id });

    if (!profile) {
      const error = new Error("User profile not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(204).send();

  } catch (error) {
    next(error);
  }
};
