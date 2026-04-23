import axios from "axios";

async function getGenderPrediction(nameParams) {
  const response = await axios.get(
    `${process.env.GENDERIZER_API_URL}?name=${nameParams}`
  );

  const { name, gender, probability } = response.data;

  if (gender === null) {
    const error = new Error("Genderizer API did not return a valid gender prediction for the provided name");
    error.statusCode = 502;
    throw error;
  }

  return { name, gender, probability };
}

export default getGenderPrediction;