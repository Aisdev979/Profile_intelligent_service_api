import axios from "axios";

async function getGenderPrediction(nameParams) {
  const response = await axios.get(
    `${process.env.GENDERIZER_API_URL}?name=${nameParams}`
  );

  const { name, gender, probability, count } = response.data;

  if (gender === null || count === 0) {
    const error = new Error("Genderizer API did not return a valid gender prediction for the provided name");
    error.statusCode = 502;
    throw error;
  }

  return { name, gender, probability, count };
}

export default getGenderPrediction;