import axios from "axios";

async function getGenderPrediction(nameParams) {
  if (!nameParams || nameParams.trim() === "") {
    const error = new Error("Missing or empty name parameter");
    error.statusCode = 400;
    throw error;
  }
  
  if (typeof nameParams !== "string") {
    const error = new Error("name is not a string");
    error.statusCode = 422;
    throw error;
  }

  const response = await axios.get(
    `https://api.genderize.io?name=${nameParams}`
  );

  const { name, gender, probability, count } = response.data;

  if (gender === null || count === 0) {
    const error = new Error("No prediction available for the provided name");
    error.statusCode = 422;                                    throw error;
  }

  return { name, gender, probability, count };
}

export default getGenderPrediction;
